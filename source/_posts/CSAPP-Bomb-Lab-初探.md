---
title: CSAPP Bomb Lab 初探，以及对 ICS 的想法
date: 2026-05-03 12:43:49
tags: [技术, 学习]
---

~~说着是 Bomb Lab，其实写了很多别的东西233，相当于总结一部分目前对 CSAPP 的感受~~

# CSAPP
全称 **Computer Systems: A Programmer's Perspective**，机械工业出版社的翻译版书名是 **《深入理解计算机系统》** 。

CSAPP 是一本讲述计算机系统的教材，广泛涵盖了计算机系统各自部分的主要主题，更为珍贵的是，它在保持广度惊人的情况下又有足够的深度，这从它的 Lab 就能看出来。

CSAPP 涵盖的主题包括：数据表示、程序的机器指令、存储系统、并发编程、文件 I/O、网络等等，第四章还讲述了 CPU 架构，差不多整本书就是想从最顶层的软件到最底层的电路开关都串起来。

这本书本身是从 CMU 的 15-213 ICS (Introduction to Computer Systems) 课程来的，相应的国内一些学校也会开设类似“系统编程“或是”计算机系统导论“的课，它们要么是直接讲 CSAPP 一部分章节要么就是根据 CSAPP 的核心内容作出更改。

# ICS 的定位
不要被 15-213 的 *Introduction* 给骗了，CS 强校的导论课跟国内多数大学的水课导论完全不是一个概念。以 CSAPP 为基础的计算机系统导论课，可以说是我目前见过最难最折磨人的计算机课程。就连 Bomb Lab 自己也幽默地调侃了这一点：

>...takes no responsibility for damage, frustration, insanity, bug-eyes, carpal-tunnel syndrome, loss of sleep, or other harm to the VICTIM...
>...对受害者造成的任何损害、挫败感、精神失常、眼球突出、腕管综合征、失眠或其他伤害，加害者概不负责...

然而兴趣的力量大概足够抵消这些了，或许我的学校不开 ICS 课反而是一件幸事，使人有足够的动力去探索，而不是先让求知欲、耐心和精力被学校给消磨掉。

# Bomb Lab
这可能是 CSAPP 里最出名的 Lab，具体内容是让学生通过 GDB 调试器去逆向分析一个已经编译好了的 Linux 二进制程序，得到 6 组拆除炸弹的正确密码。Bomb Lab 不仅锻炼学习者的工程能力，并且还会进一步建立学习者对程序语言、控制流、内存以及指令集架构的更深刻的洞见，这些都不能仅仅通过阅读教材来得到。

例如第一关的源码为：

```c
 /* Hmm...  Six phases must be more secure than one phase! */
    input = read_line();             /* Get input                   */
    phase_1(input);                  /* Run the phase               */
    phase_defused();                 /* Drat!  They figured it out!
				      * Let me know how they did it. */
    printf("Phase 1 defused. How about the next one?\n");
```

`phase_1` 和 `phase_defused` 的实现当然是不可见的，**整个 Lab 实际上就是要通过反汇编指令去倒推这类函数的实现，从而拆除炸弹**。

接下来就以第一关 phase_1 为例，再次回味一下 Bomb Lab。它虽然是最简单的一关，但是上手做一遍的收获也不小。

# phase_1
在更改二进制炸弹的读写权限后，GDB！启动！ 

```
browniecake@MSI:~/csapp-lab/bomb$ gdb bomb

GNU gdb (Ubuntu 15.1-1ubuntu1~24.04.1) 15.1
Copyright (C) 2024 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<https://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from bomb...

(gdb)

```

好的，目前我们需要的是做反汇编。在 GDB 中输入 `layout asm`，映入眼帘的是这个画面，一串 x86-64 Linux ABI 的指令：
<figure>
  {% asset_img gdb.png gdb %}
  <figcaption>disassembly</figcaption>
</figure>

通过移动方向键可以一览整个炸弹的函数接口名称，我们往下翻就能翻到 `<phase_1>`，于是我们在那里利用 `break phase_1` 打个断点，接着 `run` 运行程序：

```
Welcome to my fiendish little bomb. You have 6 phases with
which to blow yourself up. Have a nice day!
```

好的，进入了这个令人心惊胆战的二进制炸弹了。接着输入 `continue` 在我们打的断点那里停下来：
<figure>
  {% asset_img phase1.png gdb %}
  <figcaption>phase_1</figcaption>
</figure>

可以看到确实停在了 `phase_1` 的入口，我们接下来就可以仔细研究这段反汇编程序了：

```x86asm
sub    $0x8,%rsp
mov    $0x402400,%esi
callq  0x401338 <strings_not_equal>
test   %eax,%eax
je     0x400ef7 <phase_1+23>
callq  0x40143a <explode_bomb>
add    $0x8,%rsp
ret
```

## 栈指针
`sub    $0x8,%rsp` 就是把栈指针（Register Stack Pointer，寄存器 `rsp`）减 8，给局部变量开辟栈空间，并且保持 16 字节对齐——因为 `main` 在调用 `phase_1` 的时候，已经提前把 `phase_1` 的返回地址（占用 8 字节）压入栈中，使得栈指针本身就偏离了 8 个字节。

## 可疑的地址复制操作
`mov    $0x402400,%esi` 就是把数字 `0x402400` 放入 `esi`（Extended Source Index）寄存器中，这个寄存器存放的是将要读取数据的地址。欸！炸弹到这里就要读取什么东西了，这件事有点令人怀疑 `0x402400` 这个地址...后面就知道了。

## strings_not_equal 调用
`callq  0x401338 <strings_not_equal>`，其中 `0x401338` 就是函数 `strings_not_equal` 的起始地址。对，到这里就是要比较输入字符串和正确字符串了。

需要注意的是，在 ABI 约定中，`eax` 寄存器保存着函数的返回值，所以这个 `strings_not_equal` 的比较结果（0 或 1）是最终存储在 `eax` 里的。

## test %eax, %eax?????
`test   %eax,%eax` 实际执行的是对寄存器 `eax` 自身做 AND 运算，但是却不会改变 `eax` 本身的值，只会根据结果去改变另一个叫做 *标志寄存器* 的值。根据 `strings_not_equal` 函数进行推断，如果字符串相等，即返回值为 `0`，则标志寄存器的**零标志位**将被写为 `1`，如果字符串不相等就是 `0`，所以这段指令就是在设置标志位。

## 惊心动魄的跳转
`je     0x400ef7 <phase_1+23>`，如果是 `0`，即字符串相等，即密码正确，那么就跳转到 `callq  0x40143a <explode_bomb>` 的下一条指令。如果字符串不相等，即密码错误，那么就不跳转。
>**Tip**
>在 x86 架构中，JE 实际上是 JZ（Jump if Zero）的别名，两者功能完全相同。
>它们依赖标志寄存器中的零标志（Zero Flag, ZF）位：
>
>ZF = 1 → 表示上一次比较或运算结果为 0（即相等） → 执行跳转
>ZF = 0 → 表示结果不为 0（不相等） → 不跳转

## BOOM!!!
很遗憾，输入了错误的密码，程序通过 `callq  0x40143a <explode_bomb>` 指令调用了可怕的自毁程序，可以重开了。

## 成功！！！
太棒了，输入了正确的密码，程序**跳转**到了爆炸指令的下一条指令，即 `add     $0x8,%rsp`。清理最开始我们就多分配的 8 个字节，否则最后 `ret` 返回指令读取返回地址会错误地读取到 `真正的返回地址 + 8`，发生 SIGSEGV（Linux 强行停止了炸弹运行，我们安全了233）。

# 分析完成
我们已经知道了整个程序的运作流程，它写成 C 无非就是：

```c
void phase_1(char *input)
{
    char *secret_string = (char *)0x402400;
    if (strings_not_equal(input, secret_string))
    {
        explode_bomb();
    }
}
```

那个正确密码就在 `0x402400` 所指的字符串里。于是我们在 GDB 里输入 `x/s 0x402400`，我们看到：
```
(gdb) x/s 0x402400
0x402400:       "Border relations with Canada have never been better."
(gdb)
```

密码出来了，是 `Border relations with Canada have never been better.`（唐突鉴证不可避，，，）验证一下对不对：
<figure>
  {% asset_img defused.png gdb %}
  <figcaption>成功！</figcaption>
</figure>

真是一场酣畅淋漓的逆向工程体验啊。