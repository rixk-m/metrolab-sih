# OIML R 76-1 (2006) — Metrological Rules & Technical Standards

This document summarizes the core metrological rules implemented in MetroLab according to **OIML Recommendation R 76-1: Non-automatic weighing instruments (Edition 2006 (E))**.

---

## 1. Accuracy Classes & Intervals

| Class | Classification | Verification Scale Interval ($e$) | Number of Intervals ($n = \text{Max} / e$) Minimum | Number of Intervals ($n$) Maximum | Minimum Capacity ($\text{Min}$) |
|---|---|---|---|---|---|
| **Class I** | Special Accuracy | $0.001\,\text{g} \le e$ | $50\,000$ | No limit | $100\,e$ |
| **Class II** | High Accuracy | $0.001\,\text{g} \le e \le 0.05\,\text{g}$<br>$0.1\,\text{g} \le e$ | $100$<br>$5\,000$ | $100\,000$<br>$100\,000$ | $20\,e$<br>$50\,e$ |
| **Class III** | Medium Accuracy | $0.1\,\text{g} \le e \le 2\,\text{g}$<br>$5\,\text{g} \le e$ | $100$<br>$500$ | $10\,000$<br>$10\,000$ | $20\,e$ |
| **Class IIII** | Ordinary Accuracy | $5\,\text{g} \le e$ | $100$ | $1\,000$ | $10\,e$ |

---

## 2. Maximum Permissible Errors (MPE)

Per Clause 3.5.1, the maximum permissible errors for increasing or decreasing loads:

### Initial Verification (Table 6)
- **$\pm 0.5\,e$**: For loads $m$ from $0$ up to $m_1$
- **$\pm 1.0\,e$**: For loads $m$ from $> m_1$ up to $m_2$
- **$\pm 1.5\,e$**: For loads $m$ from $> m_2$ up to $\text{Max}$

Where the step thresholds $(m_1, m_2)$ in terms of verification scale intervals $e$ are:

| Accuracy Class | $\pm 0.5\,e$ Range | $\pm 1.0\,e$ Range | $\pm 1.5\,e$ Range |
|---|---|---|---|
| **Class I** | $0 \le m \le 50\,000\,e$ | $50\,000\,e < m \le 200\,000\,e$ | $> 200\,000\,e$ |
| **Class II** | $0 \le m \le 5\,000\,e$ | $5\,000\,e < m \le 20\,000\,e$ | $20\,000\,e < m \le 100\,000\,e$ |
| **Class III** | $0 \le m \le 500\,e$ | $500\,e < m \le 2\,000\,e$ | $2\,000\,e < m \le 10\,000\,e$ |
| **Class IIII** | $0 \le m \le 50\,e$ | $50\,e < m \le 200\,e$ | $200\,e < m \le 1\,000\,e$ |

### Service / In-Service Verification
Per Clause 3.5.2, MPE in service is twice ($2\times$) the MPE on initial verification.

---

## 3. Turning Points & Error Determination (Clause A.4.4.3)

For digital indication with scale interval $d$, turning point observation applies small additional weights $\Delta L$ (typically $0.1\,d$) until the display unambiguously shifts to the next indication step $I + d$:

$$P = I + 0.5\,d - \Delta L$$

Where:
- $I$ = Indication before adding test weights
- $d$ = Actual scale interval
- $\Delta L$ = Total additional weights added until transition
- $P$ = Calculated true indication before rounding

### Error Calculation:
$$E = P - L = I + 0.5\,d - \Delta L - L$$

Where $L$ is the applied reference test load.

### Corrected Error (Zero Correction):
$$E_c = E - E_0$$

Where $E_0$ is the calculated error at zero load (or near zero).

---

## 4. Repeatability (Clause 3.6.1 & A.4.7)

The difference between the maximum and minimum results of several weighings with the same load must not exceed the absolute value of the MPE for that load:

$$\Delta E = I_{\max} - I_{\min} \le |\text{mpe}|$$

Tested with at least 10 weighings at approx. $0.5\,\text{Max}$ and 10 weighings at approx. $\text{Max}$ (or 3 series of 3 weighings for Class III).

---

## 5. Eccentricity (Clause 3.6.2 & A.4.8)

With a test load of $\approx \frac{1}{3}\,\text{Max}$ (or $\frac{1}{4}\,\text{Max}$ for instruments with > 4 support points):
The error at any eccentric position (center, front-left, rear-left, rear-right, front-right) must not exceed the MPE for that load:

$$|E_{c, \text{pos}}| \le |\text{mpe}|$$

---

## 6. Implementation Reference in MetroLab

All these rules and calculations are deterministically implemented in:
- `src/lib/calculations/engine.ts`
- Evaluation Test Workspace (`/evaluations/[id]/tests/[testId]`)
- Evaluation Review & Compliance Report (`/reports/[id]`)
