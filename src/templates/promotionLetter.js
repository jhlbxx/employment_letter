export const promotionLetter = {
  id: 'promotion-letter',
  category: 'notice',
  name: {
    zh: '岗位晋升通知函',
    en: 'Promotion Notification'
  },
  description: {
    zh: '正式通告职级晋升及薪资变动。',
    en: 'Formally announces promotion and compensation changes.'
  },
  fields: [
    { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'Dave Jia', bilingual: true },
    { id: 'oldTitle', label: { zh: '原职位', en: 'Old Title' }, placeholder: 'Cook' },
    { id: 'newTitle', label: { zh: '新职位', en: 'New Title' }, placeholder: 'Head Chef' },
    { id: 'effectiveDate', label: { zh: '生效日期', en: 'Effective Date' }, type: 'date' },
  ],
  content: {
    en: `Dear **{{employeeName}}**,

Congratulations! We are pleased to formally promote you from **{{oldTitle}}** to **{{newTitle}}**, effective **{{effectiveDate}}**.

This promotion recognizes your hard work, dedication, and the significant contributions you have made to **Dave's Fish & Chips**. In your new role, you will be responsible for leading key strategic initiatives.

We look forward to your continued success with us.

Best regards,

Human Resources Department
Dave's Fish & Chips`,
    zh: `亲爱的 **{{employeeName}}**：

祝贺你！我司很高兴正式通知你，自 **{{effectiveDate}}** 起，你将由 **{{oldTitle}}** 晋升为 **{{newTitle}}**。

此次晋升是对你辛勤工作、敬职敬责以及对 **Dave's Fish & Chips** 所做重大贡献的认可。在新的岗位上，你将负责领导关键战略项目。

期待你在公司取得更大的成功。

顺颂商祺，

人力资源部
Dave's Fish & Chips`
  }
};
