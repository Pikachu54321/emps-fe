# \src\app\core

- core.module.ts

```typescript
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
```

## \startup\startup.service.ts

```typescript
zip<Observable<Object>, Observable<Object>>(v1: Observable<Object>, v2: Observable<Object>): Observable<...> (+17 overloads)
import zip
```

## \src\app\routes\routes-routing.module.ts

```typescript
const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    canActivateChild: [SimpleGuard],
```

# \src\app\layout\default\sidebar\sidebar.component.html

```html
<nz-dropdown-menu #userMenu="nzDropdownMenu">
```

# \src\app\routes\passport\register\register.component.html

`nzAddOnBeforeIcon`

# src\main.ts
全不懂