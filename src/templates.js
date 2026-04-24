export const templates = [
  {
    id: 'employment-verification',
    name: {
      zh: '通用在职证明',
      en: 'General Employment Verification'
    },
    description: {
      zh: '用于日常背景调查、银行开户或租赁证明。',
      en: 'Used for background checks, bank account opening, or rental verification.'
    },
    fields: [
      { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'John Doe' },
      { id: 'passportId', label: { zh: '身份证/护照号', en: 'ID/Passport No.' }, placeholder: 'E12345678' },
      { id: 'role', label: { zh: '当前职位', en: 'Current Position' }, placeholder: 'Senior Cook' },
      { id: 'startDate', label: { zh: '入职日期', en: 'Start Date' }, type: 'date' },
      { id: 'salary', label: { zh: '年薪 (可选)', en: 'Annual Salary (Optional)' }, placeholder: '60,000' },
    ],
    content: {
      en: `To Whom It May Concern,

This is to certify that **{{employeeName}}** (ID/Passport No: {{passportId}}) is currently employed by **Dave's Fish & Chips** as a **{{role}}**.

**{{employeeName}}** joined our company on **{{startDate}}** and is currently a full-time, permanent employee in good standing.
{{#salary}}Their current annual gross salary is **\${{salary}}**.{{/salary}}

Please do not hesitate to contact our HR department if you require any further information.

Best Regards,

Human Resources Department
Dave's Fish & Chips`,
      zh: `致相关人士：

兹证明 **{{employeeName}}**（身份证/护照号：{{passportId}}）现就职于 **Dave's Fish & Chips**，担任 **{{role}}** 一职。

**{{employeeName}}** 自 **{{startDate}}** 起加入我司，目前为全职正式员工，表现良好。
{{#salary}}其当前的年薪总额为 **\${{salary}}**。{{/salary}}

如需了解更多信息，请随时联系我司人力资源部。

此致，

人力资源部
Dave's Fish & Chips`
    }
  },
  {
    id: 'visa-support',
    name: {
      zh: '签证申请支持信',
      en: 'Visa Application Support'
    },
    description: {
      zh: '用于员工申请旅游或商务签证。',
      en: 'Used for employees applying for tourist or business visas.'
    },
    fields: [
      { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'John Doe' },
      { id: 'passportNo', label: { zh: '护照号码', en: 'Passport No.' }, placeholder: 'G12345678' },
      { id: 'destination', label: { zh: '目的地国家', en: 'Destination Country' }, placeholder: 'United Kingdom' },
      { id: 'leaveStart', label: { zh: '休假开始日期', en: 'Leave Start Date' }, type: 'date' },
      { id: 'leaveEnd', label: { zh: '休假结束日期', en: 'Leave End Date' }, type: 'date' },
    ],
    content: {
      en: `To: The Embassy/Consulate of {{destination}}

Re: Visa Application for **{{employeeName}}** (Passport No: {{passportNo}})

Dear Visa Officer,

This letter is to confirm that **{{employeeName}}** is a permanent employee of **Dave's Fish & Chips**. We are aware of their travel plans to **{{destination}}** from **{{leaveStart}}** to **{{leaveEnd}}**.

Their leave of absence has been approved by the company. All expenses related to this trip will be covered by the employee. We guarantee that **{{employeeName}}** will return to their duties at Dave's Fish & Chips immediately upon the completion of their trip.

We kindly request you to grant the necessary visa.

Yours sincerely,

Human Resources Department
Dave's Fish & Chips`,
      zh: `致：{{destination}} 驻华使领馆

关于：**{{employeeName}}**（护照号：{{passportNo}}）的签证申请

尊敬的签证官：

兹证明 **{{employeeName}}** 为 **Dave's Fish & Chips** 的正式员工。我司已知悉其在 **{{leaveStart}}** 至 **{{leaveEnd}}** 期间前往 **{{destination}}** 的旅行计划。

该员工的假期申请已获批准。此次旅行的所有费用将由员工个人承担。我司保证 **{{employeeName}}** 将在旅行结束后按时返回公司，继续履行其岗位职责。

恳请给予办理相关签证。

此致，

人力资源部
Dave's Fish & Chips`
    }
  },
  {
    id: 'mortgage-reference',
    name: {
      zh: '房贷/购房参考信',
      en: 'Mortgage/Housing Reference'
    },
    description: {
      zh: '提供详细的薪资和就业稳定性证明，用于贷款。',
      en: 'Provides detailed salary and job stability verification for loans.'
    },
    fields: [
      { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'John Doe' },
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
  },
  {
    id: 'promotion-letter',
    name: {
      zh: '岗位晋升通知函',
      en: 'Promotion Notification'
    },
    description: {
      zh: '正式通告职级晋升及薪资变动。',
      en: 'Formally announces promotion and compensation changes.'
    },
    fields: [
      { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'John Doe' },
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
  },
  {
    id: 'resignation-acceptance',
    name: {
      zh: '离职申请接受函',
      en: 'Resignation Acceptance'
    },
    description: {
      zh: '正式回复员工的辞职申请，确认最后工作日。',
      en: 'Formally responds to resignation and confirms the last working day.'
    },
    fields: [
      { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'John Doe' },
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
  },
  {
    id: 'termination-notice',
    name: {
      zh: '劳动合同解除通知书',
      en: 'Notice of Termination'
    },
    description: {
      zh: '正式解除劳动关系，包含赔偿金和通知期细节。',
      en: 'Formal termination of employment including compensation and notice details.'
    },
    fields: [
      { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'John Doe' },
      { id: 'terminationDate', label: { zh: '解雇日期', en: 'Termination Date' }, type: 'date' },
      { id: 'noticePeriod', label: { zh: '通知期', en: 'Notice Period' }, placeholder: '30 days / 1 month' },
      { id: 'statutoryComp', label: { zh: '法定赔偿金', en: 'Statutory Compensation' }, placeholder: '5,000' },
      { id: 'extraComp', label: { zh: '额外赔偿金', en: 'Extra Compensation' }, placeholder: '2,000' },
      { id: 'reason', label: { zh: '解雇原因 (可选)', en: 'Reason (Optional)' }, placeholder: 'Operational redundancy' },
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
  }
];
