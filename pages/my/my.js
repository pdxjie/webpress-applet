import config from '../../utils/config.js'

var app = getApp();
var webSiteName = config.getWebsiteName;
var domain = config.getDomain;
var wechat = config.getWecat
var openId = config.openId

Page({
    /**
     * 页面的初始数据
     */
    data: {
        subscription: "",
        userInfo: {},
        openid: '',
        target: '',
        curField: '',
        isLoginPopup: false,
        webSiteName: webSiteName,
        domain: domain,
        wechat: wechat,
        nickName: '',
        inFinChat: false,
        uploadImageSize: config.uploadImageSize,
        role: '',
        list: [
            // {
            //   name: "浏览",
            //   icon: "cicon-eye",
            //   color: "#9DCA06",
            //   path: "/pages/readlog/readlog?key=1"
            // },
            {
                name: "评论",
                icon: "cicon-popover",
                color: "#FFB300",
                path: "/pages/readlog/readlog?key=2"
            },
            {
                name: "点赞",
                icon: "cicon-favorite",
                color: "#53bcf5",
                path: "/pages/readlog/readlog?key=3"
            },
            {
                name: "订阅",
                color: "#F37D7D",
                icon: "cicon-notice-active",
                path: "/pages/readlog/readlog?key=5"
            },
        ],
        loading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getUserInfo()
        console.log(openId, 'openId')
    },
    // 获取用户信息
    getUserInfo() {
        const assessToken = wx.getStorageSync('token')
        if (assessToken && assessToken !== '') {
            const userInfo = wx.getStorageSync('userInfo')
            const openId = wx.getStorageSync('openid')
            const roles = wx.getStorageSync('roles')
            let role = ''
            if (roles[0] === 'USER') {
                role = '见习者'
            }
            this.setData({
                userInfo: userInfo,
                openid: openId,
                nickName: userInfo.nickName,
                role: role
            })
        }
    },
    bindgetuserinfo() {
        this.setData({
            loading: true
        })
        wx.login({
            success: (res) => {
                if (res.code) {
                    this.setData({
                        code: res.code,
                    })
                    var openId = res.code
                    var url = domain + '/basic/wx/login?openId=' + res.code
                    wx.request({
                        url: url,
                        method: 'GET',
                        success: (res) => {
                            const {
                                data: {
                                    data
                                }
                            } = res
                            this.setData({
                                userInfo: data.userInfo
                            })
                            // 存储用户信息
                            wx.setStorageSync('token', data.token)
                            wx.setStorageSync('roles', data.roles)
                            wx.setStorageSync('userInfo', data.userInfo)
                            wx.setStorageSync('openid', openId);
                            wx.setStorageSync('userId', data.userInfo.userId);
                            this.setData({
                                loading: false
                            })
                            this.getUserInfo()
                        },
                        fail: () => {
                            console.log('error....');
                        }
                    })
                } else {
                    console.log('请求wx.login失败！' + res.errMsg)
                }
            }
        })
    },
    closeLoginPopup() {
        this.setData({
            isLoginPopup: false
        });
    },
    openLoginPopup() {
        this.setData({
            isLoginPopup: true
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 3
            })
        }
    },
    tapToUrl(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    },
    tapCopy(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.value,
            success() {
                wx.showToast({
                    title: '复制成功！',
                    icon: 'none'
                })
            },
            fail() {
                wx.showToast({
                    title: '复制失败！',
                    icon: 'none'
                })
            },
        });
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    confirm: function () {
        this.setData({
            'dialog.hidden': true,
            'dialog.title': '',
            'dialog.content': ''
        })
    },
    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail
    },
    showModal(e) {
        this.setData({
            target: e.currentTarget.dataset.key
        })
    },
    onEdit(e) {
        let key = e.currentTarget.dataset.key
        if (this.data.userInfo.despending == '2' && key === 'description') {
            wx.showToast({
                title: '正在审核中,无法编辑',
                icon: 'none'
            })
            return
        }

        this.setData({
            showPop: true
        })
    },
    onClose() {
        this.setData({
            target: false
        })
    },
    onSave() {
        this.editNickName()
    },

    // 修改个人简介
    editNickName() {
        const self = this
        let nickname = this.data.nickName
        console.log(nickname)
        if (!nickname) {
            wx.showToast({
                title: '请输入昵称！',
                icon: 'none'
            })
            return
        }
        wx.showLoading({
            title: '正在更新...',
        })
        const openid = wx.getStorageSync('openid')
        console.log(openid, 'openId.,.....')
        const vo = {
            nickName: nickname,
            openId: openid
        }
        wx.request({
            url: domain + '/pdx/user/update/nickName',
            method: "PUT",
            data: vo,
            success: res => {
                const {data} = res
                wx.setStorageSync('userInfo', data.data);
                self.setData({
                    userInfo: data.data,
                    target: false
                });
                wx.showToast({
                    title: data.message,
                    icon: 'success',
                    duration: 900,
                    success: function () {
                    }
                })
            },
            fail: err => {
                console.log(err, 'err')
            }
        })
    }
})