(function () {
  'use strict';

  angular
    .module('transfers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Komunikaty',
      state: 'transfers.list',
      type: 'dropdown',
      roles: ['manager']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'transfers.list', {
      title: 'Wysłane',
      state: 'transfers.list.outcoming',
      roles: ['manager']
    });
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'transfers.list', {
      title: 'Odebrane',
      state: 'transfers.list.incoming',
      roles: ['manager']
    });


  }
})();
