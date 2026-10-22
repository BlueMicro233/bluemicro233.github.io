---
title: Fibonacci 数列的通项公式
date: 2025-12-04 22:17:07
tags: [数学, 学习]
mathjax: true
---
## 递推公式

Fibonacci 数列的递推公式为：
<div>
    $$
    F_{n+1} = F_{n} + F_{n-1} \ (n = 1, 2, \dots)
    $$
</div>

其中 $F_0 = 1, F_1 = 1 .$

## 矩阵表示

上式可以用矩阵表示：

<div>
    $$
    \begin{pmatrix}  
    F_{n+1} \\  
    F_{n}   
    \end{pmatrix} 
    =
    \begin{pmatrix}  
    1 & 1 \\  
    1 & 0  
    \end{pmatrix} 

    \begin{pmatrix}  
    F_n \\  
    F_{n-1}   
    \end{pmatrix} 
    $$
</div>

## 求解方法

令 $\mathbf{A} = 
    \begin{pmatrix}  
    1 & 1 \\  
    1 & 0  
    \end{pmatrix}$ 


<div>
$$
    \begin{pmatrix}  
    F_{n+1} \\  
    F_{n}   
    \end{pmatrix} 
    =
    \mathbf{A}

    \begin{pmatrix}  
    F_n \\  
    F_{n-1}   
    \end{pmatrix} 
    =
    \mathbf{A}^2

    \begin{pmatrix}  
    F_{n-1} \\  
    F_{n-2}   
    \end{pmatrix} 
    =
    \dots
    =
    \mathbf{A}^n

    \begin{pmatrix}  
    F_1 \\  
    F_{0}   
    \end{pmatrix}
    =
    \mathbf{A}^n

    \begin{pmatrix}  
    1 \\  
    1   
    \end{pmatrix}
    $$
</div>

通过寻找与矩阵 $\mathbf{A}$ 相似的对角矩阵 $\mathbf{\Lambda}$ ，可以利用 $\mathbf{P}\mathbf{\Lambda}^n\mathbf{P}^{-1}$ 来得到 $\mathbf{A}^n.$

## 通项

特征多项式 $f(\lambda)=|\mathbf{A}-\lambda \mathbf{E}|$ ，令 $f(\lambda)=0$ 解得特征值 $\lambda_1 = \frac{1+\sqrt{5}}{2}, \lambda_2 = \frac{1-\sqrt{5}}{2} .$

$\lambda_1, \lambda_2$ 对应的特征向量分别为 $\mathbf{\xi}_1 = 
    \begin{pmatrix}  
    \frac{1+\sqrt{5}}{2} \\  
    1   
    \end{pmatrix} , \mathbf{\xi}_2 = 
    \begin{pmatrix}  
    \frac{1-\sqrt{5}}{2} \\  
    1   
    \end{pmatrix}$ ，得到过渡矩阵及其逆矩阵：

<div>
$$
    \mathbf{P}
    =
    \begin{pmatrix}  
    \frac{1+\sqrt{5}}{2} & \frac{1-\sqrt{5}}{2} \\  
    1 & 1  
    \end{pmatrix}  \ \    \mathbf{P}^{-1}
    =
    \begin{pmatrix}  
    \frac{1}{\sqrt{5}} & -\frac{1-\sqrt{5}}{2\sqrt{5}} \\  
    -\frac{1}{\sqrt{5}} & \frac{1+\sqrt{5}}{2\sqrt{5}}
    \end{pmatrix} 
$$
</div>

对角矩阵：

<div>
$$
    \mathbf{\Lambda}
    =
    \begin{pmatrix}  
    \frac{1+\sqrt{5}}{2} & 0 \\  
    0 & \frac{1-\sqrt{5}}{2}  
    \end{pmatrix} 
$$
</div>

由相似变换 $\mathbf{A} = \mathbf{P}\mathbf{\Lambda}\mathbf{P}^{-1}$ 得到 $\mathbf{A}^n = \mathbf{P}\mathbf{\Lambda}^n\mathbf{P}^{-1}.$

所以：

<div>
$$
    \mathbf{A}^n
    =
    \begin{pmatrix}  
    \frac{1+\sqrt{5}}{2} & \frac{1-\sqrt{5}}{2} \\  
    1 & 1  
    \end{pmatrix}
    \begin{pmatrix}  
    \frac{1+\sqrt{5}}{2} & 0 \\  
    0 & \frac{1-\sqrt{5}}{2}  
    \end{pmatrix}^n
    \begin{pmatrix}  
    \frac{1}{\sqrt{5}} & -\frac{1-\sqrt{5}}{2\sqrt{5}} \\  
    -\frac{1}{\sqrt{5}} & \frac{1+\sqrt{5}}{2\sqrt{5}}
    \end{pmatrix} 
$$
</div>

<div>
$$
    \begin{align}
    \begin{pmatrix}  
    F_{n+1} \\  
    F_{n}   
    \end{pmatrix} 
    =
    \mathbf{A}^n
    \begin{pmatrix}  
    1 \\  
    1   
    \end{pmatrix} 
    &=
    \begin{pmatrix}  
    \frac{1+\sqrt{5}}{2} & \frac{1-\sqrt{5}}{2} \\  
    1 & 1  
    \end{pmatrix}
    \begin{pmatrix}  
    \frac{1+\sqrt{5}}{2} & 0 \\  
    0 & \frac{1-\sqrt{5}}{2}  
    \end{pmatrix}^n
    \begin{pmatrix}  
    \frac{1}{\sqrt{5}} & -\frac{1-\sqrt{5}}{2\sqrt{5}} \\  
    -\frac{1}{\sqrt{5}} & \frac{1+\sqrt{5}}{2\sqrt{5}}
    \end{pmatrix} 
    \begin{pmatrix}  
    1 \\  
    1   
    \end{pmatrix} \\
    &=
    \begin{pmatrix}  
    \frac{1}{\sqrt{5}} \big(\frac{1+\sqrt{5}}{2} \big)^{n+2}  - \frac{1}{\sqrt{5}} \big(\frac{1-\sqrt{5}}{2} \big)^{n+2} \\  
    \frac{1}{\sqrt{5}} \big(\frac{1+\sqrt{5}}{2} \big)^{n+1} - \frac{1}{\sqrt{5}} \big(\frac{1-\sqrt{5}}{2} \big)^{n+1}   
    \end{pmatrix} 
    \end{align}
$$
</div>

**所以 Fibonacci 数列的通项公式为：**

<div>
$$
    F_{n}
    =
    \frac{1}{\sqrt{5}} \bigg(\frac{1+\sqrt{5}}{2} \bigg)^{n+1} - \frac{1}{\sqrt{5}} \bigg(\frac{1-\sqrt{5}}{2} \bigg)^{n+1}   
$$
</div>
