(function () {
  'use strict';

  angular
    .module('donnors')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Donnors',
      state: 'donnors',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'donnors', {
      title: 'List Donnors',
      state: 'donnors.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'donnors', {
      title: 'Create Donnor',
      state: 'donnors.create',
      roles: ['user']
    });
  }
})();
