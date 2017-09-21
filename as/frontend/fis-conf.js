'use strict';

var ignore = ['node_modules/**', 'output/**', 'fis-conf.js', 'App/Runtime/**'];
// 只需要编译 html 文件，以及其用到的资源。
fis.set('project.files', ['/src/html/**', '/src/images/flag/**', '/src/images/imageClipper/**', '/vendor/**','/json/**']);
fis.set('project.ignore', ignore);

fis.match('*', {
	deploy: fis.plugin('local-deliver', {
		to: 'output'
	})
});

fis.match('*.less', {
	parser: fis.plugin('less'),
	useHash: true,
	rExt: '.css'
}).match('*.handlebars', {
	isHtmlLike: true
});

fis.media('pred').match('*.js', {
	optimizer: fis.plugin('uglify-js'),
}).match('*.css', {
	optimizer: fis.plugin('clean-css'),
	useHash: true
}).match('*.png', {
	optimizer: fis.plugin('png-compressor'),
}).match('*.html:js', {
	optimizer: fis.plugin('uglify-js'),
}).match('*.html:css', {
	optimizer: fis.plugin('clean-css'),
}).match('::package',{
	postpackager: fis.plugin('loader', {
		allInOne: true
	})
});



fis.match('/src/(**)', {
	release: '$1'
}).match('/src/html/(**)', {
	release: '$1'
});


fis.hook('cmd', {
	baseUrl: '/',
	paths: {
		'arale': '/vendor/widget/arale',
		'js': '/js',
		'$': '/js/jquery-1.8.2.min.js',
		'$-debug': '/js/jquery-1.8.2.min.js',
		'jquery': '/js/jquery-1.8.2.min.js',
		'jquery-debug': 'jquery/jquery/1.8.2/jquery-debug',
		'seajs-debug': 'seajs/seajs-debug/1.1.1/seajs-debug',

		'store': '/vendor/widget/gallery/store/1.3.14/store',
		'es5-safe': '/vendor/widget/gallery/es5-safe/0.9.2/es5-safe',
		'json': '/vendor/widget/gallery/json/1.0.3/json',
		'jsuri': '/vendor/widget/gallery/jsuri/1.2.2/jsuri',
		'md5': '/vendor/widget/gallery/blueimp-md5/1.1.0/md5',

		'base': '/vendor/widget/arale/base/1.1.1/base',
		'class': '/vendor/widget/arale/class/1.1.0/class',
		'widget': '/vendor/widget/arale/widget/1.1.1/widget',
		'validator': '/vendor/widget/arale/validator/0.9.7/validator',
		'handlebars': '/vendor/widget/gallery/handlebars/1.0.2/handlebars.js',
		'templatable': '/vendor/widget/arale/templatable/0.9.2/templatable',
		'cookie': '/vendor/widget/arale/cookie/1.0.2/cookie',
		'popup': '/vendor/widget/arale/popup/1.1.6/popup',
		'tabs': '/vendor/widget/arale/switchable/1.0.2/tabs',
		'slide': '/vendor/widget/arale/switchable/1.0.2/slide',
		'carousel': '/vendor/widget/arale/switchable/1.0.2/carousel',
		'accordion': '/vendor/widget/arale/switchable/1.0.2/accordion',
		'tip': '/vendor/widget/arale/tip/1.2.2/tip',
		'autocomplete': '/vendor/widget/arale/autocomplete/1.2.4/autocomplete',
		'dialog': '/vendor/widget/arale/dialog/1.3.0/dialog',
		'confirmbox': '/vendor/widget/arale/dialog/1.3.0/confirmbox',
		'calendar': '/vendor/widget/arale/calendar/1.0.0/calendar',
		'overlay':'/vendor/widget/arale/overlay/1.1.4/overlay',

		'list': '/src/js/widget/list/list',
		'addresscommon': '/src/js/widget/order/address-common',
		'pages': '/src/js/widget/pages/pages',
		'commonAjax': '/src/js/lib/common-ajax',
		//公共注册校验
		'registerVerify':'/src/js/widget/common/common-register-verify.js',
		'cartDialog':'/src/js/widget/cart/common-cart-dialog.js',
		'agreementDialog':'/src/js/widget/common/common-agreement-dialog.js',
		'timeTo':'/src/js/widget/common/time.js',
		'test': '/src/js/widget/test.js'
	}

}).match('/src/(js/**)', {
	isMod: false,
	moduleId: '/$1'
}).match('/**/(arale/**)', {
	isMod: true,
	moduleId: '$1'
}).match('/**/(arale/**).js', {
	isMod: true,
	moduleId: '$1'
}).match('/src/js/*.js', {
	isMod: false
}).match('/src/js/{util,uEditor,common}/**.js', {
	isMod: false
}).match('/src/js/lib/*.js', {
    isMod: false
}).match('/src/js/page/*.js', {
    isMod: false
}).match('/src/js/widget/cart/cartBase.js', {
    isMod: false
}).match('/**/(gallery/**).js', {
    isMod: false
});



fis.match('::package', {
	postpackager: fis.plugin('loader', {
		// allInOne: true,
		useInlineMap: true,
		resourceType: 'cmd'

		// processor: {
		// 	'.html': 'html',
		// 	'.md': 'html'
		// },
		// scriptPlaceHolder: /\{% endblock js %\}|<!--BODY_END-->/,
		// stylePlaceHolder: /\{% endblock css %\}|<!--HEAD_END-->/,
		// allInOne: {
		// 	css: 'www/resource/pkg/auto_combine_${hash}.css',
		// 	js: 'www/resource/pkg/auto_combine_${hash}.js',
		// 	ignore: []
		// }
	})
});
