export const employmentVerification = {
  id: 'employment-verification',
  category: 'employment',
  name: {
    zh: '通用在职证明',
    en: 'General Employment Verification'
  },
  description: {
    zh: '用于日常背景调查、银行开户或租赁证明。',
    en: 'Used for background checks, bank account opening, or rental verification.'
  },
  fields: [
    { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'Dave Jia', bilingual: true },
    { id: 'passportId', label: { zh: '身份证/护照号', en: 'ID/Passport No.' }, placeholder: 'E12345678' },
    { id: 'role', label: { zh: '当前职位', en: 'Current Position' }, placeholder: 'Senior Cook', bilingual: true },
    { id: 'startDate', label: { zh: '入职日期', en: 'Start Date' }, type: 'date' },
    { id: 'salary', label: { zh: '年薪', en: 'Annual Salary' }, placeholder: '60,000' },
  ],
  content: {
    en: `To Whom It May Concern,

This is to certify that **{{employeeName}}**{{#passportId}} (ID/Passport No: {{passportId}}){{/passportId}} is currently employed by **Dave's Fish & Chips** as a **{{role}}**.

**{{employeeName}}** joined our company on **{{startDate}}** and is currently a full-time, permanent employee in good standing.
{{#salary}}Their current annual gross salary is **\${{salary}}**.{{/salary}}

Please do not hesitate to contact our HR department if you require any further information.

Best Regards,

Human Resources Department
Dave's Fish & Chips`,
    zh: `致相关人士：

兹证明 **{{employeeName}}**{{#passportId}}（身份证/护照号：{{passportId}}）{{/passportId}}现就职于 **Dave's Fish & Chips**，担任 **{{role}}** 一职。

**{{employeeName}}** 自 **{{startDate}}** 起加入我司，目前为全职正式员工，表现良好。
{{#salary}}其当前的年薪总额为 **\${{salary}}**。{{/salary}}

如需了解更多信息，请随时联系我司人力资源部。

此致，

人力资源部
Dave's Fish & Chips`
  }
};
