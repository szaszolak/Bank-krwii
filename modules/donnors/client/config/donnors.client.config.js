(function () {
  'use strict';

  angular
    .module('donnors')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Dawcy',
      state: 'donnors',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'donnors', {
      title: 'Lista',
      state: 'donnors.list',
      roles: ['empolyee','manager','admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'donnors', {
      title: 'Dodaj',
      state: 'donnors.create',
      roles: ['empolyee','manager','admin']
    });
        // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'donnors', {
      title: 'Honorowi dawcy',
      state: 'donnors.honorable.list',
      roles: ['*']
    });
  }
})();
