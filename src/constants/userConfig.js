/**
 * 用户权限配置表
 * 
 * role 选项说明:
 * - 'admin': 超级管理员 (拥有所有权限 + 防伪核验工具)
 * - 'recruitment': 招聘职能 (仅显示雇主信类模板)
 * - 'legal': 离职/法务职能 (显示通知类与离职类模板)
 */
export const USER_CONFIG = [
  {
    staffId: '84297156',
    accessCode: 'ADMIN999',
    role: 'admin',
    name: 'Dave Jia'
  },
  {
    staffId: '84240066',
    accessCode: 'JOIN2024',
    role: 'recruitment',
    name: 'Jingmin Yu'
  },
  {
    staffId: '84105388',
    accessCode: 'EXIT2024',
    role: 'employment relations',
    name: 'Ying Yu'
  }
];
