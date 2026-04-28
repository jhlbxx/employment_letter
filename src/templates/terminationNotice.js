export const terminationNotice = {
  id: 'termination-notice',
  category: 'termination',
  name: {
    zh: '劳动合同解除通知书',
    en: 'Notice of Termination'
  },
  description: {
    zh: '正式解除劳动关系，包含赔偿金和通知期细节。',
    en: 'Formal termination of employment including compensation and notice details.'
  },
  fields: [
    { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'Dave Jia', bilingual: true },
    { id: 'terminationDate', label: { zh: '解雇日期', en: 'Termination Date' }, type: 'date' },
    { id: 'noticePeriod', label: { zh: '通知期', en: 'Notice Period' }, placeholder: '30 days / 1 month' },
    { id: 'statutoryComp', label: { zh: '法定赔偿金', en: 'Statutory Compensation' }, placeholder: '5,000' },
    { id: 'extraComp', label: { zh: '额外赔偿金', en: 'Extra Compensation' }, placeholder: '2,000' },
    { id: 'reason', label: { zh: '解雇原因', en: 'Reason' }, placeholder: 'Operational redundancy' },
  ],
  content: {
    en: `Dear **{{employeeName}}**,

We regret to inform you that **Dave's Fish & Chips** has decided to terminate your employment contract effective **{{terminationDate}}**.

In accordance with your employment agreement and local labor laws:
- **Notice Period:** You will serve a notice period of **{{noticePeriod}}**.
- **Statutory Compensation:** A sum of **\${{statutoryComp}}** will be paid as per legal requirements.
- **Extra Compensation:** An additional ex-gratia payment of **\${{extraComp}}** will be provided.

{{#reason}}**Reason for Termination:** {{reason}}{{/reason}}

All final payments and required documentation will be processed by your last working day. We thank you for your time with us.

Sincerely,

Human Resources Department
Dave's Fish & Chips`,
    zh: `亲爱的 **{{employeeName}}**：

我们很遗憾地通知你，**Dave's Fish & Chips** 已决定自 **{{terminationDate}}** 起解除与你的劳动合同。

根据劳动合同约定及现行劳动法律：
- **通知期**：你的通知期为 **{{noticePeriod}}**。
- **法定赔偿金**：公司将依法向你支付 **\${{statutoryComp}}**。
- **额外赔偿金**：公司将额外向你支付 **\${{extraComp}}** 作为补偿。

{{#reason}}**解除劳动关系原因**：{{reason}}{{/reason}}

所有结算款项及相关证明文件将在你最后工作日之前完成。感谢你在职期间的付出。

此致，

人力资源部
Dave's Fish & Chips`
  }
};
