(function () {
  'use strict';

  angular
    .module('blooddonations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Donacje krwii',
      state: 'blooddonations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'blooddonations', {
      title: 'Lista',
      state: 'blooddonations.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'blooddonations', {
      title: 'Dodaj',
      state: 'blooddonations.create',
      roles: ['user']
    });
  }
})();
