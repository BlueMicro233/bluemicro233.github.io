---
title: 从零推导 Schrödinger 方程
date: 2026-01-01 15:06:58
tags: [学习, 数学, 物理]
mathjax: true
---
哇，2026 年的第一篇文章！

最近闲得无聊，又不想学 Unity 游戏制作（本来就不是很想学2333），居然买了本量子力学教材来消遣。虽然后面很难，但还是学到了很多东西，对自然界/微观世界的本质有了进一步的认识，同时也是我追星理论物理学家戈登·弗里曼的一大步（戈登的博士论文和量子力学有关）。

# Schrödinger 方程简介
薛定谔（Schrödinger）方程是量子力学的基本方程，它与牛顿第二定律 $F=ma$ 在经典力学体系的地位相当。

这篇文章推导的薛定谔方程是定态的（time-independent），标准的含时薛定谔方程这次暂时不推，仅给出简单解释。

# 核心思想
能量守恒：**总能量 = 动能 + 势能**

这个其实就是标准薛定谔方程里哈密顿（Hamiltonian）量的核心。

# Recap
## 波函数
在量子力学里，波函数用于描述一个量子系统的状态。

类比于声波的波幅，量子力学的波函数用记号 $\psi(x)$ 表示，可以看出它其实就是**量子波幅**，一个量子系统的状态由量子波幅刻画，强度由模方 $|\psi(x)|^2$ 表示。

## 测不准原理
<div>
    $$
    \Delta {x} \Delta {p} \ge \frac{\hbar}{2 \pi }
    $$
</div>

其中 $\hbar$ 是约化普朗克常量。

由量子力学的另一位主要缔造者海森堡（Heisenberg）提出。

$\Delta$ 就是测量误差的意思，这个表达式想告诉我们的是：在任何情况下，我们都无法精确确定一个基本粒子的位置 $x$ 和动量 $p$ ，**总会存在** $\Delta {x}$ **和** $\Delta {p}$ **测量误差**。

所以，测量粒子在某个特定时间的状态是无意义的，我们只能通过描述它们的**概率分布**来寻求更为普遍的规律。这是量子力学与经典力学的根本区别。

# 能量守恒
$\psi$ 本身是概率波的波幅，而概率波的强度 $|\psi(x)|^2$ 才能真正刻画概率分布，由于必须满足概率密度函数的非负性。直观地说，$|\psi(x)|^2$ 越大的地方，在那里找到粒子的概率就越大。

接下来，将正式推导薛定谔方程：

一个粒子的总能量 $E$ 等于动能 $K$ 加上势能 $V$：
<div>
    $$
    E = K + V
    $$
</div>

而动能关系是我们非常熟悉的：
<div>
    $$
    K = \frac{1}{2}mv^2
    $$
</div>

根据动量 $p=mv$ ，动能可以写成：
<div>
    $$
    K = \frac{p^2}{2m}
    $$
</div>

得到能量守恒公式：
<div>
    $$
    E = \frac{p^2}{2m} + V(x)
    $$
</div>

# 推导动量算子
德布罗意（De Broglie）关系告诉我们：粒子的动量 $p$ 与波长 $\lambda$ 成反比：
<div>
    $$
    p = \frac{h}{\lambda} = \hbar k
    $$
</div>

其中 $\hbar$ 是约化普朗克常量，$k$ 是空间频率，也即在一米内有几个周期（波长）。

由能量守恒公式 $E = \frac{p^2}{2m} + V(x)$ 知道，我们需要对 $p^2$ 进行处理，由于量子力学下的动量遵循 $p = \hbar k$ ，它体现了物质粒子的波粒二象性。

## 先写一个最简单的波
在量子力学中，一个拥有确定动量 $p$ 的自由粒子，其波函数通常用复指数形式表示（这比 $\sin$ 和 $\cos$ 处理起来更方便，因为 $\mathrm{e}^x$ 的导数还是它自己）：
<div>
    $$
    \psi(x) = A \mathrm{e}^{i k x}
    $$
</div>

将波数 $k$ 替换掉，波函数就变成了含有动量 $p$ 的形式：
<div>
    $$
    \psi(x) = A \mathrm{e}^{i \frac{p}{\hbar} x}
    $$
</div>

## 尝试提取动量 $p$
现在的目标是：**寻找一个运算法则（算子），当它作用在 $\psi(x)$ 上时，结果等于 $p$ 乘以 $\psi(x)$。**

先试着写出对 $x$ 的导数公式：
<div>
    $$
    \frac{\mathrm{d}}{\mathrm{d}x} \psi(x) = \frac{\mathrm{d}}{\mathrm{d}x} \left( A \mathrm{e}^{i \frac{p}{\hbar} x} \right)
    $$
</div>

求导得到：
<div>
    $$
    \frac{\mathrm{d}}{\mathrm{d}x} \psi(x) = \left( i \frac{p}{\hbar} \right) \cdot \underbrace{A \mathrm{e}^{i \frac{p}{\hbar} x}}_{\psi(x)}
    $$
</div>

所以：
<div>
    $$
    \frac{\mathrm{d}}{\mathrm{d}x} \psi(x) = i \frac{p}{\hbar} \psi(x)
    $$
</div>

为了把 $p$ 单独弄出来，于是把等式两边的常数移项：
<div>
    $$
    \frac{\hbar}{i} \frac{\mathrm{d}}{\mathrm{d}x} \psi(x) = p \psi(x)
    $$
</div>

分子分母同乘 $i$ ：
<div>
    $$
    -i\hbar \frac{\mathrm{d}}{\mathrm{d}x} \psi(x) = p \psi(x)
    $$
</div>

我们得到了动量算子 $\hat{p}$ ，它作用在波函数上就是上式的效果。写成表达式就是：
<div>
    $$
    \hat{p} = -i\hbar \frac{\mathrm{d}}{\mathrm{d}x}
    $$
</div>


## 推导 $p^2$ 对应的算子
算子的平方 $\hat{p}^2$ 意味着连续作用两次：
<div>
    $$
    \hat{p}^2 \psi(x) = \hat{p} \left( \hat{p} \psi(x) \right)
    $$
</div>

将我们刚才得到的定义代进去：
<div>
    $$
    \hat{p}^2 \psi(x) = \left( -i\hbar \frac{\mathrm{d}}{\mathrm{d}x} \right) \left( -i\hbar \frac{\mathrm{d}}{\mathrm{d}x} \psi(x) \right)
    $$
</div>

- 常数部分：$(-i\hbar) \cdot (-i\hbar) = i^2 \hbar^2 = -\hbar^2$
- 微分部分：$\frac{\mathrm{d}}{\mathrm{d}x} \left( \frac{\mathrm{d}}{\mathrm{d}x} \right) = \frac{\mathrm{d}^2}{\mathrm{d}x^2}$（二阶导数）

于是：
<div>
    $$
    \hat{p}^2 \psi(x) = -\hbar^2 \frac{\mathrm{d}^2}{\mathrm{d}x^2} \psi(x)
    $$
</div>

最终，得到动量平方对应的算子：
<div>
    $$
    \hat{p}^2 = -\hbar^2 \frac{\mathrm{d}^2}{\mathrm{d}x^2}
    $$
</div>


# 推导方程
现在，我们将经典能量公式翻译成算子语言，作用在波函数 $\psi$ 上：

还记方程的核心思想吗？那就是 **总能量 = 动能 + 势能** ，我们刚刚又得到了动量算子，把它写成下面的形式：
<div>
    $$
    E \psi = \left( \frac{\hat{p}^2}{2m} + V(x) \right) \psi
    $$
</div>

注意现在整个表达式不是单纯的乘法，在数学上讲是一种变换。

**代入刚才推导的动能算符，就得到了定态薛定谔方程：**
<div>
    $$
    E \psi(x) = -\frac{\hbar^2}{2m} \frac{\mathrm{d}^2\psi(x)}{\mathrm{d}x^2} + V(x)\psi(x)
    $$
</div>


# 方程含义
- **动能项：** $-\frac{\hbar^2}{2m} \frac{\mathrm{d}^2\psi(x)}{\mathrm{d}x^2}$

 - $\frac{\mathrm{d}^2\psi(x)}{\mathrm{d}x^2}$ 描述了波函数的曲率（二阶导），当这个二阶导越大的时候（i.e. 波函数弯曲得越厉害的时候），动能越大。

- **势能项：** $V(x)\psi(x)$ 

 - 它是外部环境决定的，比如原子核对电子的吸引力，或者一个电场。它直接乘在 $\psi$ 上，表示在位置 $x$ 处的势能大小。

- **总能量：** $E$ 

 - 这是一个常数。它告诉我们在这种波函数形态下，系统的总能量是多少。

假设一个电子被束缚在一个很小的盒子里，波函数必须弯得非常急才能使空间上的误差边界归零，这就导致动能极高：**这解释了为什么原子核外的电子不会塌进原子核，因为如果不确定位置太小，动能就会大到把它弹开。**

刚才的方程是不含时的，如果想知道波函数随时间 $t$ 怎么演化，我们需要对时间求导，所以薛定谔方程的完整形态是：
<div>
    $$
    i\hbar \frac{\partial \psi}{\partial t} = \hat{H} \psi
    $$
</div>

其中 $\hat{H}$ 就是文章开头谈到的哈密顿量，它其实就是我们推导出来的动量算子和势能向相加：
<div>
    $$
    \hat{H} = -\frac{\hbar^2}{2m} \frac{\partial^2}{\partial x^2} + V(x)
    $$
</div>

既然薛定谔方程是个方程，那么就肯定要在实际情况下求解它。求解薛定谔方程其实就是在问：**什么样的概率波形状 $\psi(x)$，能让它的**弯曲程度（动能）**加上**所在位置的势能**，在各处加起来都等于同一个常数 $E$ ？**

凡是满足这个条件的波，就是电子可能存在的状态，比如原子里的 $s$ 轨道、$p$ 轨道（死去的结构化学还在攻击我）