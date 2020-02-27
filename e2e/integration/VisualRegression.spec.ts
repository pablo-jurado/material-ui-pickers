describe('Visual Regression', () => {
  const pages = [
    {
      url: '/',
      name: 'Landing',
      withDarkTheme: true,
    },
    {
      url: '/localization/date-fns',
      name: 'Date-fns localization',
    },
    {
      url: '/demo/datepicker',
      name: 'DatePicker demo',
      hardResponsive: true,
      withDarkTheme: true,
      scenarios: {
        'Opened DesktopDatePicker': () => {
          cy.get('[data-mui-test=open-picker-from-keyboard')
            .first()
            .scrollIntoView()
            .click({ force: true });
        },
      },
    },
    {
      url: '/demo/timepicker',
      name: 'TimePicker demo',
      responsive: true,
      withDarkTheme: true,
      scenarios: {
        'Opened timepicker': () => {
          cy.get('[data-mui-test=open-picker-from-keyboard')
            .first()
            .scrollIntoView()
            .click({ force: true });
        },
      },
    },
    {
      url: '/demo/datetime-picker',
      name: 'DateTimePicker demo',
      responsive: true,
      withDarkTheme: true,
      scenarios: {
        'Opened datetimepicker': () => {
          cy.get('[data-mui-test=open-picker-from-keyboard')
            .first()
            .scrollIntoView()
            .click({ force: true });
        },
      },
    },
    {
      url: '/guides/css-overrides',
      name: 'Css overrides',
      scenarios: {
        'Custom material-ui theme': () => {
          cy.get('[data-mui-test=css-override] [data-mui-test=open-picker-from-keyboard')
            .first()
            .scrollIntoView()
            .click({ force: true });
        },
      },
    },
  ];

  pages.forEach(page => {
    context(page.name, () => {
      beforeEach(() => {
        const now = new Date('2019-01-01T09:41:00.000Z');
        cy.clock(now.getTime());

        cy.visit(page.url);
        // PLEASE FIX THIS WEIRD HACK: 2 times toggle theme to update injected styles.
        cy.toggleTheme();
        cy.toggleTheme();
      });

      it(`Displays ${page.name} page`, () => {
        cy.percySnapshot(page.name);
      });

      if (page.withDarkTheme) {
        it(`Displays ${page.name} page in dark theme`, () => {
          cy.percySnapshot(`Dark, ${page.name}`);
        });
      }

      if (page.scenarios) {
        const defaultWidthForScenarios = page.hardResponsive ? [1280] : [1280, 375];

        Object.entries(page.scenarios).forEach(([name, execute]) => {
          if (!execute || typeof execute !== 'function') {
            throw new Error('Execute function in scenario is required');
          }

          context(`${page.name} ${name}`, () => {
            it(`${page.name} scenario: ${name}`, () => {
              execute();
              cy.percySnapshot(`${page.name}: ${name}`, { widths: defaultWidthForScenarios });
            });

            if (page.hardResponsive) {
              it(`${page.name} scenario: ${name} on mobile`, () => {
                cy.viewport('iphone-x');

                execute();
                cy.percySnapshot(`${page.name} scenario: ${name}`, { widths: [375] });
              });
            }

            if (page.withDarkTheme) {
              it(`${page.name} scenario: ${name} in dark theme`, () => {
                cy.toggleTheme();
                execute();

                cy.percySnapshot(`Dark ${page.name}: ${name}`);
              });
            }

            if (page.withDarkTheme && page.hardResponsive) {
              it(`${page.name} scenario: ${name} on mobile in dark theme`, () => {
                cy.viewport('iphone-x');
                cy.toggleTheme();

                execute();
                cy.percySnapshot(`Dark ${page.name}: ${name}`, { widths: [375] });
              });
            }
          });
        });
      }
    });
  });
});
