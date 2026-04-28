export const canadaTermination = {
  id: 'canada-termination-package',
  category: 'termination',
  name: {
    zh: '加拿大解雇与豁免协议 (Canada Release)',
    en: 'Termination Package & Release (Canada)'
  },
  description: {
    zh: '符合安省 ESA 标准的完整解雇包，含 Full and Final Release 法律条款。',
    en: 'Full termination package including Release, compliant with Ontario ESA standards.'
  },
  fields: [
    { id: 'issueDate', label: { zh: '签发日期', en: 'Issue Date' }, type: 'date' },
    { id: 'employeeName', label: { zh: '员工姓名', en: 'Employee Name' }, placeholder: 'Full Name', bilingual: true },
    { id: 'employeeAddress', label: { zh: '员工地址', en: 'Employee Address' }, placeholder: '123 Street, City, ON' },
    { id: 'firstName', label: { zh: '称呼 (名)', en: 'First Name' }, placeholder: 'First Name' },
    { id: 'contractDate', label: { zh: '原合同签署日期', en: 'Original Contract Date' }, type: 'date' },
    { id: 'grossSalary', label: { zh: '税前年薪 (CAD)', en: 'Gross Annual Salary' }, placeholder: '80,000' },
    { id: 'noticeWeeks', label: { zh: '代通知金周数', en: 'Notice Weeks' }, placeholder: '4' },
    { id: 'severanceWeeks', label: { zh: '法定遣散费周数', en: 'Severance Weeks' }, placeholder: '0' },
    { id: 'esaNoticeEnd', label: { zh: 'ESA通知期结束日', en: 'ESA Notice End Date' }, type: 'date' },
    { id: 'additionalWeeks', label: { zh: '额外补偿周数', en: 'Additional Bonus Weeks' }, placeholder: '4' },
    { id: 'benefitsEndDate', label: { zh: '福利截止日期', en: 'Benefits End Date' }, type: 'date' },
    { id: 'hrbpName', label: { zh: 'HRBP姓名', en: 'HRBP Name' }, placeholder: 'HR Name' },
    { id: 'hrbpEmail', label: { zh: 'HRBP邮箱', en: 'HRBP Email' }, placeholder: 'hr@example.com' },
    { id: 'officeAddress', label: { zh: '办公室地址', en: 'Office Address' }, placeholder: 'Toronto Office' },
    { id: 'expiryTime', label: { zh: '协议失效时间', en: 'Expiry Time' }, placeholder: '5:00 PM' },
    { id: 'expiryDate', label: { zh: '协议失效日期', en: 'Expiry Date' }, type: 'date' },
    { id: 'directorName', label: { zh: '总监姓名', en: 'Director Name' }, placeholder: 'Director Name' },
    { id: 'directorTitle', label: { zh: '总监职位', en: 'Director Title' }, placeholder: 'RC Director' },
  ],
  content: {
    en: `WITHOUT PREJUDICE
STRICTLY PERSONAL AND CONFIDENTIAL
HAND DELIVERED<br/>
**Date:** {{issueDate}}<br/>
**{{employeeName}}**
{{employeeAddress}}<br/>
Dear {{firstName}}:<br/>
This letter confirms our discussion of **today’s date**, whereby we informed you that your employment with **Dave’s Fish and Chips Technologies Canada Co., Ltd.** (“Dave’s Fish and Chips”) is terminated effective **immediately**. Accordingly, you will not be required to report for work after today. As discussed, your termination is not for cause. In exchange for your agreement with these terms under this letter, Dave’s Fish and Chips is prepared to provide you with the following:<br/>
1. In accordance with the terms of your employment contract dated **{{contractDate}}** (the “Employment Contract”) and in compliance with Dave’s Fish and Chips’s obligations under the *Ontario Employment Standards Act, 2000* (“ESA”), Dave’s Fish and Chips will provide you with pay in lieu of notice equal to **{{noticeWeeks}}** weeks’ of your regular salary {{#severanceWeeks}}and **{{severanceWeeks}}** weeks’ statutory severance pay (calculated according to your gross base annual salary of **CAD \${{grossSalary}}**){{/severanceWeeks}}, less the applicable statutory and other usual and necessary withholdings required by law. You will also receive any vacation pay accrued up to the end of the ESA notice period ending **{{esaNoticeEnd}}**, less applicable statutory withholdings required by law. The foregoing amounts are inclusive of all termination pay and severance entitlements pursuant to the ESA or common law.<br/>
2. In accordance with the terms of your Employment Contract, on a without prejudice basis, conditional upon execution of the enclosed **Full and Final Release**, Dave’s Fish and Chips is prepared to provide you an additional payment equal to **{{additionalWeeks}}** weeks’ regular salary (calculated according to your gross base annual salary of **CAD \${{grossSalary}}**), less required deductions and withholdings as required by law.<br/>
3. If you have any eligible but unclaimed expenses, please ensure that you inform us immediately but no later than three business days from the date of this letter and, provided such expense claims are compliant with our policies and all supporting documents are duly submitted, the expenses will be reimbursed to you by direct deposit on or about the Wednesday within two weeks of approval.<br/>
4. Your enrollment in the extended medical benefits program will continue until the end of the applicable statutory notice period and will end on **{{benefitsEndDate}}**. You have the ability to convert your group life and health insurance coverage to an individual plan should you choose to do so within the applicable conversion window.<br/>
5. If you have enrolled in the Dave’s Fish and Chips group RRSP, your participation will end concurrently with the payment of your final regular wages. A termination package will be automatically mailed to your address as is recorded on your Sun Life file.<br/>
6. After your final payment, a Record of Employment will be created and sent electronically to Service Canada.<br/>
7. We wish to remind you of your ongoing legal obligations to Dave’s Fish and Chips. All information about our organization must be held in strict confidence. The terms regarding intellectual property rights and non-solicitation of employees remain in force.<br/>
8. All Dave’s Fish and Chips equipment and property must be returned immediately, including but not limited to computer equipment and access badges.<br/>
In exchange for the payment set out in item 2 above, we require you to execute closing documentation (including the enclosed **Full and Final Release**). Please indicate your acceptance by returning the duly signed documents to **{{hrbpName}}** via email at **{{hrbpEmail}}** or by post to **{{officeAddress}}** on or before **{{expiryTime}}** on **{{expiryDate}}**, at which time this offer will become null and void.<br/>
Yours sincerely,<br/>
**{{directorName}}**
{{directorTitle}}
**DAVE’S FISH AND CHIPS TECHNOLOGIES CANADA CO., LTD.**<br/>
<div style="page-break-before: always;"></div>
### FULL AND FINAL RELEASE<br/>
IN CONSIDERATION of the conditional terms set out in item 2 of the letter from **DAVE’S FISH AND CHIPS TECHNOLOGIES CANADA CO., LTD.** to **{{employeeName}}** dated **{{issueDate}}**, I, **{{employeeName}}**, hereinafter called the Releasor, hereby release and forever discharge DAVE’S FISH AND CHIPS TECHNOLOGIES CANADA CO., LTD., its officers, directors, servants, and agents, from any and all actions, causes of action, claims and demands of any kind whatsoever arising out of or relating to my employment or the termination thereof.<br/>
AND I, THE RELEASOR, HEREBY DECLARE that I understand that the said consideration is payment for and inclusive of all and any termination pay in lieu of notice, severance pay, vacation pay and any other payments pursuant to the *Ontario Employment Standards Act, 2000* and *Canada Labour Code*.<br/>
I confirm that I have been afforded an opportunity to obtain independent legal advice and confirm that I am executing this Release voluntarily and without duress.<br/>
IN WITNESS WHEREOF, I, **{{employeeName}}**, have executed this Full and Final Release on this _______ day of __________, 20__.<br/><br/><br/>
__________________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___________________________
Signature of Witness&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Signature of Releasor`,
    zh: `个人机密 / 法律保护文档
即刻递交<br/>
**日期：** {{issueDate}}<br/>
**{{employeeName}}**
{{employeeAddress}}<br/>
亲爱的 {{firstName}}：<br/>
本函旨在确认我们在**今日**的谈话。我们正式通知你，你在 **Dave’s Fish and Chips Technologies Canada Co., Ltd.**（以下简称“公司”）的劳动关系将于**即刻**正式解除。基于双方之前的沟通，此次解除不属于过失性解除。作为签署本协议及随附豁免书的回报，公司将为你提供以下方案：<br/>
1. 根据你于 **{{contractDate}}** 签署的劳动合同及安大略省《就业标准法》(ESA) 的规定，公司将向你支付 **{{noticeWeeks}}** 周的代通知金{{#severanceWeeks}}及 **{{severanceWeeks}}** 周的法定遣散费（按税前年薪 **CAD \${{grossSalary}}** 计算）{{/severanceWeeks}}。相关 vacation pay 将计算至 **{{esaNoticeEnd}}**。上述金额已包含 ESA 或普通法项下的所有解雇补偿权利。<br/>
2. 额外补偿：若你签署并返还随附的**《最终豁免书 (Full and Final Release)》**，公司将额外为你提供相当于 **{{additionalWeeks}}** 周薪资的补偿金。<br/>
3. 报销：任何未结清的报销请在三日内提交，相关费用将按公司政策在两周内完成。
4. 福利：你的医疗福利将延续至 **{{benefitsEndDate}}**。你可以在规定时间内选择将团体保险转为个人保险。<br/>
5. **保密义务**：你需继续履行合同项下的保密、知识产权保护及不招揽条款。
6. **资产归还**：请立即归还公司所有电脑、门禁卡等财产。<br/>
请于 **{{expiryDate}}** 的 **{{expiryTime}}** 之前，将签署后的文档发送给 HRBP **{{hrbpName}}** ({{hrbpEmail}})。逾期未签署，此方案将自动失效。<br/>
感谢你对公司的贡献，祝你未来一切顺利。<br/>
此致，<br/>
**{{directorName}}**
{{directorTitle}}
**DAVE’S FISH AND CHIPS TECHNOLOGIES CANADA CO., LTD.**<br/>
<div style="page-break-before: always;"></div>
### 最终豁免书 (FULL AND FINAL RELEASE)<br/>
基于公司于 **{{issueDate}}** 向 **{{employeeName}}** 提供的离职方案第 2 条所述之代价，我，**{{employeeName}}**（以下简称“豁免人”），兹声明免除并永久解除 DAVE’S FISH AND CHIPS TECHNOLOGIES CANADA CO., LTD. 及其高级职员、董事、员工等一切因劳动关系及其解除而产生的索赔、诉讼或要求。<br/>
我确认已获得寻求独立法律意见的机会，并声明我是在自愿且无压力的情况下签署本豁免书。<br/>
见证人签名：__________________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;豁免人签名：___________________________
日期：20__ 年 ___ 月 ___ 日`
  }
};
