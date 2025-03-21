/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/about/About`; params?: Router.UnknownInputParams; } | { pathname: `/categories/Categories`; params?: Router.UnknownInputParams; } | { pathname: `/help/Help`; params?: Router.UnknownInputParams; } | { pathname: `/walking/walking`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/about/About`; params?: Router.UnknownOutputParams; } | { pathname: `/categories/Categories`; params?: Router.UnknownOutputParams; } | { pathname: `/help/Help`; params?: Router.UnknownOutputParams; } | { pathname: `/walking/walking`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/about/About${`?${string}` | `#${string}` | ''}` | `/categories/Categories${`?${string}` | `#${string}` | ''}` | `/help/Help${`?${string}` | `#${string}` | ''}` | `/walking/walking${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/about/About`; params?: Router.UnknownInputParams; } | { pathname: `/categories/Categories`; params?: Router.UnknownInputParams; } | { pathname: `/help/Help`; params?: Router.UnknownInputParams; } | { pathname: `/walking/walking`; params?: Router.UnknownInputParams; };
    }
  }
}
