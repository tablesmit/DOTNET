define([
	'ember',
	'eotu'
], function (Ember, Eotu) {
	return Ember.ObjectController.extend({
		form: {
			username: null,
			password: null
		},
		actions: {
			login: function () {
				if (!this.get('form.username') || !this.get('form.password')) {
					alert('请输入账户和密码');
					return;
				}
				var _this = this;
				var json = JSON.stringify(this.get('form'));
				var sockid;
				sockid = Eotu.Connect('192.168.1.126', 60005, {
					'connected': function () {
						alert(1);
						Eotu.SendMessage(1, 'yili', 'hello');
					},
					'change': function (code, status) {
						//alert(status);
					},
					'receive': function (data) {
						if (data.indexOf("\r\n\r\n") >= 0) {
							data = data.substring(data.indexOf("\r\n\r\n") + 4, data.length);
						}
						if (data.length > 0) {
							var obj = jQuery.parseJSON(data);
							if (obj.status === 'ok') {
								Eotu.set('Profile', Ember.Object.extend(obj.data).create());
								_this.transitionToRoute('/main/contacts');
							} else {
								alert(obj.message);
							}
						}
					},
					'tcp': false
				});
			}
		}
	});
});