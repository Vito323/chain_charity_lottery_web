/** 我的绑定关系（钱包菜单，对齐 App `MeBindScreen`） */
export const BIND_RELATIONS_PATH = '/user/bind-relations';

/** 节点下绑定用户列表（我的节点「查看绑定」，对齐 App `MeNodeBindUsersScreen`） */
export const NODE_BINDINGS_PATH = '/user/node-bindings';

export const nodeBindingsHref = (nodeId: string) =>
  `${NODE_BINDINGS_PATH}/${encodeURIComponent(nodeId)}`;
