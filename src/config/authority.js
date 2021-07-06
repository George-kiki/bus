class Authority {
    /**
     * 构造函数
     */
    constructor() {
        this.getAuthority();
    }

    static isRight = false; // 是否已经获取过权限
    static authority = {   // 权限
    }

    /**
     * 设置权限
     */
    getAuthority() {
        this.formatAuthority().forEach(val => {
            Authority.authority[val] = true;
        });
    }

    /**
     * 格式化权限
     */
    formatAuthority() {
        let temp = [];
        changeListStructure(JSON.parse(window.localStorage.getItem('userInfo') || '{"menuList":[]}').menuList,temp);

        return temp;

		/**
		 * 变更列表结构
		 * @param {Array} list [目录]
		 * @param {Array} temp [中介]
		 */
		function changeListStructure(list,temp) {
			list.forEach(val => {
				temp.push(val.permission.replace(/[:]/g,"_"));

				if(val.children) {
					changeListStructure(val.children,temp);
				}
			});
        }
    }
}

export default (callback) => {
    if(!Authority.isRight) {
        new Authority();
        Authority.isRight = true;
    }

    callback && callback();
    return Authority.authority;
};
