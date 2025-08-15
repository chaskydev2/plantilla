export const getInitials = (name: string | null | undefined):string => {
    if (!name || typeof name !== 'string') return '';
    
    const parts = name.split(' ').filter(part => part.length > 0);
    
    if (parts.length === 0) return '';
    
    const initials = parts.slice(0, 2).map(part => part[0].toUpperCase());
    
    return initials.join('').substring(0, 2);
  }