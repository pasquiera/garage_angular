import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const fader =
trigger('routeAnimations', [
    transition('* => *', [
      style({
        position: 'relative',
      }),

      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        })
      ], { optional: true }),

      group([
        query(':leave', [
          animate(200, style({
            opacity: 0,
          }))
        ], { optional: true }),

        query(':enter', [
          style({
            opacity: 0
          }),
          animate(200, style({
            opacity: 1,
          }))
        ], { optional: true })
      ])
    ])
  ])