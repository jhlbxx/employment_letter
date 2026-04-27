export const mortgageReference = {
  id: 'mortgage-reference',
  category: 'employment',
  name: {
    zh: '房贷/购房参考信',
    en: 'Mortgage/Housing Reference'
  },
  description: {
    zh: '提供详细的薪资和就业稳定性证明，用于贷款。',
    en: 'Provides detailed salary and job stability verification for loans.'
  },
  fields: [
    { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'Dave Jia', bilingual: true },
    { id: 'monthlyBase', label: { zh: '月基本工资', en: 'Monthly Base Salary' }, placeholder: '5,000' },
    { id: 'annualBonus', label: { zh: '年终奖金', en: 'Annual Bonus' }, placeholder: '10,000' },
    { id: 'jobTitle', label: { zh: '职级/职位', en: 'Job Title' }, placeholder: 'Head Chef' },
  ],
  content: {
    en: `To: Mortgage Underwriting Department

Subject: Employment and Income Verification for **{{employeeName}}**

We confirm that **{{employeeName}}** has been employed with **Dave's Fish & Chips** in the capacity of **{{jobTitle}}**.

Their current compensation details are as follows:
- Monthly Base Salary: **\${{monthlyBase}}**
- Annual Target Bonus: **\${{annualBonus}}**

We consider **{{employeeName}}**'s employment to be stable and are pleased with their performance. This information is provided in confidence at the request of our employee.

Sincerely,

Human Resources Department
Dave's Fish & Chips`,
    zh: `致：贷款审核部门

主旨：关于 **{{employeeName}}** 的就业及收入证明

兹证明 **{{employeeName}}** 目前在 **Dave's Fish & Chips** 担任 **{{jobTitle}}** 一职。

其当前的薪酬细节如下：
- 月基本工资：**\${{monthlyBase}}**
- 年度目标奖金：**\${{annualBonus}}**

我司认为 **{{employeeName}}** 的职业前景稳定，对其工作表现非常满意。本证明系应员工要求出具。

此致，

人力资源部
Dave's Fish & Chips`
  }
};
