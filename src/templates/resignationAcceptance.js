export const resignationAcceptance = {
  id: 'resignation-acceptance',
  category: 'termination',
  name: {
    zh: '离职申请接受函',
    en: 'Resignation Acceptance'
  },
  description: {
    zh: '正式回复员工的辞职申请，确认最后工作日。',
    en: 'Formally responds to resignation and confirms the last working day.'
  },
  fields: [
    { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'Dave Jia', bilingual: true },
    { id: 'lastDay', label: { zh: '最后工作日', en: 'Last Working Day' }, type: 'date' },
    { id: 'manager', label: { zh: '部门经理', en: 'Department Manager' }, placeholder: 'Dave Smith' },
  ],
  content: {
    en: `Dear **{{employeeName}}**,

We have received your resignation letter dated today. After discussion with your manager, **{{manager}}**, we formally accept your resignation.

Your last day of employment with **Dave's Fish & Chips** will be **{{lastDay}}**. We would like to thank you for your service and wish you the very best in your future endeavors.

Please coordinate with HR for the final clearance process.

Sincerely,

Human Resources Department
Dave's Fish & Chips`,
    zh: `亲爱的 **{{employeeName}}**：

我司已收到你于今日提交的辞职信。在与你的经理 **{{manager}}** 沟通后，我们正式接受你的辞职申请。

你在 **Dave's Fish & Chips** 的最后工作日将为 **{{lastDay}}**。感谢你为公司所做的贡献，并祝愿你在未来的职业生涯中一切平稳。

请与人力资源部协作完成离职清算手续。

此致，

人力资源部
Dave's Fish & Chips`
  }
};
