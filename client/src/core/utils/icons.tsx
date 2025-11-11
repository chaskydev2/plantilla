import React from 'react';
import { Briefcase, Wrench, Hammer, Scissors, Truck, Tag, Image, User } from 'lucide-react';

type ResolvedIconComponent = React.ComponentType<any> | null;

export type ResolvedIcon =
  | { kind: 'component'; Component: ResolvedIconComponent }
  | { kind: 'img'; url: string }
  | { kind: 'svg'; svg: string }
  | { kind: 'none' };

// Local icons map (used by the app). Keep small and extend as needed.
const localMap: Record<string, React.ComponentType<any>> = {
  briefcase: Briefcase,
  wrench: Wrench,
  hammer: Hammer,
  scissors: Scissors,
  truck: Truck,
  tag: Tag,
  image: Image,
  user: User,
};

const reactIconCache = new Map<string, ResolvedIconComponent>();
const remoteIconCache = new Map<string, { url?: string; svg?: string } | null>();

/**
 * Resolve an icon id to either a React component, an image URL, or raw SVG.
 * Supported id formats:
 * - local:<name>     -> look up in localMap
 * - remote:<id>      -> fetch /api/icons and find matching id
 * - <lib>:<Component> -> dynamic import from react-icons/<lib>
 */
export async function resolveIcon(iconId?: string | null): Promise<ResolvedIcon> {
  if (!iconId) return { kind: 'none' };

  // local:briefcase
  if (iconId.startsWith('local:')) {
    const name = iconId.replace('local:', '');
    const Comp = localMap[name];
    return Comp ? { kind: 'component', Component: Comp } : { kind: 'none' };
  }

  // remote:123 or remote:my-icon
  if (iconId.startsWith('remote:')) {
    const id = iconId.replace('remote:', '');
    if (remoteIconCache.has(id)) {
      const cached = remoteIconCache.get(id) || null;
      if (!cached) return { kind: 'none' };
      if (cached.url) return { kind: 'img', url: cached.url };
      if (cached.svg) return { kind: 'svg', svg: cached.svg };
      return { kind: 'none' };
    }

    try {
      const res = await fetch('/api/icons');
      if (!res.ok) {
        remoteIconCache.set(id, null);
        return { kind: 'none' };
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        remoteIconCache.set(id, null);
        return { kind: 'none' };
      }
      const found = data.find((it: any) => String(it.id) === String(id));
      remoteIconCache.set(id, found || null);
      if (!found) return { kind: 'none' };
      if (found.url) return { kind: 'img', url: found.url };
      if (found.svg) return { kind: 'svg', svg: found.svg };
      return { kind: 'none' };
    } catch (e) {
      remoteIconCache.set(id, null);
      return { kind: 'none' };
    }
  }

  // react-icons style: fa:FaBeer
  if (iconId.includes(':')) {
    const [lib, compName] = iconId.split(':');
    const cacheKey = `${lib}:${compName}`;
    if (reactIconCache.has(cacheKey)) {
      const C = reactIconCache.get(cacheKey) || null;
      return C ? { kind: 'component', Component: C } : { kind: 'none' };
    }

    try {
      // dynamic import the requested lib
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pkg = `react-icons/${lib}`;
      const mod = await import(/* webpackChunkName: "react-icons-[request]" */ pkg);
      const Comp = (mod as any)[compName] as ResolvedIconComponent;
      reactIconCache.set(cacheKey, Comp || null);
      return Comp ? { kind: 'component', Component: Comp } : { kind: 'none' };
    } catch (e) {
      reactIconCache.set(cacheKey, null);
      return { kind: 'none' };
    }
  }

  // unknown format
  return { kind: 'none' };
}

export function IconRenderer({ iconId, className, style, ...rest }: { iconId?: string | null; className?: string; style?: React.CSSProperties } & Record<string, any>) {
  const [resolved, setResolved] = React.useState<ResolvedIcon>({ kind: 'none' });

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const r = await resolveIcon(iconId);
      if (!mounted) return;
      setResolved(r);
    })();
    return () => { mounted = false; };
  }, [iconId]);

  if (resolved.kind === 'component' && resolved.Component) {
    const C = resolved.Component;
    return <C className={className} style={style} {...rest} />;
  }
  if (resolved.kind === 'img' && resolved.url) {
    return <img src={resolved.url} alt="icon" className={className} style={style} {...rest} />;
  }
  if (resolved.kind === 'svg' && resolved.svg) {
    return <span className={className} style={style} dangerouslySetInnerHTML={{ __html: resolved.svg }} {...rest} />;
  }
  // fallback: empty placeholder
  return <span className={className} style={style} />;
}

export default resolveIcon;
