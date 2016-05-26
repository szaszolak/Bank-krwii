(function () {
  'use strict';

  angular
    .module('transfers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Transfers',
      state: 'transfers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'transfers', {
      title: 'List Transfers',
      state: 'transfers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'transfers', {
      title: 'Create Transfer',
      state: 'transfers.create',
      roles: ['user']
    });
  }
})();
