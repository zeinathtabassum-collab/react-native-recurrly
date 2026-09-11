// Central icon exports using @expo/vector-icons
// Usage: import { Ionicons, Icons } from '@/assets/constants/icons';

import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  AntDesign,
  FontAwesome5,
} from '@expo/vector-icons';
import { ComponentProps } from 'react';

// ─── Type Helpers ────────────────────────────────────────────────────────────

export type IoniconsName = ComponentProps<typeof Ionicons>['name'];
export type MaterialIconsName = ComponentProps<typeof MaterialIcons>['name'];
export type FeatherName = ComponentProps<typeof Feather>['name'];

// ─── Re-export icon sets for direct use ──────────────────────────────────────

export { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 };

// ─── Common Icon Names (for easy reference) ───────────────────────────────────

export const Icons = {
  // Navigation
  home: { set: 'Ionicons', name: 'home' } as const,
  homeOutline: { set: 'Ionicons', name: 'home-outline' } as const,
  search: { set: 'Ionicons', name: 'search' } as const,
  settings: { set: 'Ionicons', name: 'settings' } as const,
  settingsOutline: { set: 'Ionicons', name: 'settings-outline' } as const,
  back: { set: 'Ionicons', name: 'arrow-back' } as const,
  forward: { set: 'Ionicons', name: 'arrow-forward' } as const,

  // Actions
  add: { set: 'Ionicons', name: 'add' } as const,
  addCircle: { set: 'Ionicons', name: 'add-circle' } as const,
  close: { set: 'Ionicons', name: 'close' } as const,
  edit: { set: 'Feather', name: 'edit-2' } as const,
  delete: { set: 'Ionicons', name: 'trash-outline' } as const,
  share: { set: 'Ionicons', name: 'share-social-outline' } as const,
  copy: { set: 'Feather', name: 'copy' } as const,

  // Status & Feedback
  checkmark: { set: 'Ionicons', name: 'checkmark' } as const,
  checkmarkCircle: { set: 'Ionicons', name: 'checkmark-circle' } as const,
  warning: { set: 'Ionicons', name: 'warning-outline' } as const,
  info: { set: 'Ionicons', name: 'information-circle-outline' } as const,
  error: { set: 'Ionicons', name: 'close-circle-outline' } as const,

  // User & Profile
  person: { set: 'Ionicons', name: 'person-outline' } as const,
  people: { set: 'Ionicons', name: 'people-outline' } as const,

  // Media
  camera: { set: 'Ionicons', name: 'camera-outline' } as const,
  image: { set: 'Ionicons', name: 'image-outline' } as const,
  mic: { set: 'Ionicons', name: 'mic-outline' } as const,

  // Misc
  heart: { set: 'Ionicons', name: 'heart-outline' } as const,
  star: { set: 'Ionicons', name: 'star-outline' } as const,
  notification: { set: 'Ionicons', name: 'notifications-outline' } as const,
  calendar: { set: 'Ionicons', name: 'calendar-outline' } as const,
  time: { set: 'Ionicons', name: 'time-outline' } as const,
  location: { set: 'Ionicons', name: 'location-outline' } as const,
  filter: { set: 'Ionicons', name: 'filter-outline' } as const,
  menu: { set: 'Ionicons', name: 'menu-outline' } as const,
  more: { set: 'Ionicons', name: 'ellipsis-horizontal' } as const,
  link: { set: 'Feather', name: 'link' } as const,
  lock: { set: 'Feather', name: 'lock' } as const,
  unlock: { set: 'Feather', name: 'unlock' } as const,
  mail: { set: 'Ionicons', name: 'mail-outline' } as const,
  phone: { set: 'Ionicons', name: 'call-outline' } as const,
  refresh: { set: 'Ionicons', name: 'refresh-outline' } as const,
  download: { set: 'Feather', name: 'download' } as const,
  upload: { set: 'Feather', name: 'upload' } as const,
  sun: { set: 'Feather', name: 'sun' } as const,
  moon: { set: 'Feather', name: 'moon' } as const,
};
