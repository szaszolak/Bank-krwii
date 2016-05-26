(function () {
  'use strict';

  angular
    .module('stations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Stacje Krwiodastwa',
      state: 'stations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'stations', {
      title: 'Przeglądaj',
      state: 'stations.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'stations', {
      title: 'Dodaj',
      state: 'stations.create',
      roles: ['admin']
    });
      // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'stations', {
      title: 'Zarządzaj',
      state: 'stations.manage',
      roles: ['manager','admin']
    });
  }
})();
