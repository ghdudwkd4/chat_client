var uiBlock = (function(){
    var $viewLoading = $('<div style="display:none;"><img src="/img/loading.gif" alt=""/></div>');

    return {
        loadingUIshow : function(){
            $viewLoading.css('left', $('body').offset().left);
            $viewLoading.children().css('padding-top', ((window.innerHeight)/3) + $(document).scrollTop());
            $viewLoading.css('width', '100%');
            $viewLoading.css('height', $(document).height());
            $viewLoading.css({
                'border':'0px solid #fff',
                'position':'absolute',
                'text-align': 'center',
                'padding-top': '0px',
                'background': '#ffffff',
                'opacity': '0.3',
                'z-index':'10000'
            });
            $viewLoading.show();
            $('body').prepend($viewLoading);
        },
        loadingUIhide : function(){
            $viewLoading.fadeOut(500);
        }
    }
})();