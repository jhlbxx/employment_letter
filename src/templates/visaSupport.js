export const visaSupport = {
  id: 'visa-support',
  category: 'employment',
  name: {
    zh: '签证申请支持信',
    en: 'Visa Application Support'
  },
  description: {
    zh: '用于员工申请旅游或商务签证。',
    en: 'Used for employees applying for tourist or business visas.'
  },
  fields: [
    { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'Dave Jia', bilingual: true },
    { id: 'passportNo', label: { zh: '护照号码', en: 'Passport No.' }, placeholder: 'G12345678' },
    { id: 'destination', label: { zh: '目的地国家', en: 'Destination Country' }, placeholder: 'United Kingdom', bilingual: true },
    { id: 'leaveStart', label: { zh: '休假开始日期', en: 'Leave Start Date' }, type: 'date' },
    { id: 'leaveEnd', label: { zh: '休假结束日期', en: 'Leave End Date' }, type: 'date' },
  ],
  content: {
    en: `To: The Embassy/Consulate of {{destination}}

Re: Visa Application for **{{employeeName}}**{{#passportNo}} (Passport No: {{passportNo}}){{/passportNo}}

Dear Visa Officer,

This letter is to confirm that **{{employeeName}}** is a permanent employee of **Dave's Fish & Chips**. We are aware of their travel plans to **{{destination}}** from **{{leaveStart}}** to **{{leaveEnd}}**.

Their leave of absence has been approved by the company. All expenses related to this trip will be covered by the employee. We guarantee that **{{employeeName}}** will return to their duties at Dave's Fish & Chips immediately upon the completion of their trip.

We kindly request you to grant the necessary visa.

Yours sincerely,

Human Resources Department
Dave's Fish & Chips`,
    zh: `致：{{destination}} 驻华使领馆

关于：**{{employeeName}}**{{#passportNo}}（护照号：{{passportNo}}）{{/passportNo}}的签证申请

尊敬的签证官：

兹证明 **{{employeeName}}** 为 **Dave's Fish & Chips** 的正式员工。我司已知悉其在 **{{leaveStart}}** 至 **{{leaveEnd}}** 期间前往 **{{destination}}** 的旅行计划。

该员工的假期申请已获批准。此次旅行的所有费用将由员工个人承担。我司保证 **{{employeeName}}** 将在旅行结束后按时返回公司，继续履行其岗位职责。

恳请给予办理相关签证。

此致，

人力资源部
Dave's Fish & Chips`
  }
};
