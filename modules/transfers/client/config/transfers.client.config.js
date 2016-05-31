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
      state: 'transfers',
      type: 'dropdown',
      roles: ['manager']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'transfers', {
      title: 'Skrzynka',
      state: 'transfers.list',
      roles: ['manager']
    });

  }
})();
