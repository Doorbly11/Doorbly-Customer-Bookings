import React from 'react';
import {
  Wrench,
  Zap,
  Droplets,
  Sparkles,
  Paintbrush,
  Tv,
  Monitor,
  Sprout,
  Flower2,
  Footprints,
  Hammer,
  Car,
  Navigation,
  Package,
  GraduationCap,
  Palette,
  Store,
  PartyPopper,
  Users,
  HeartHandshake,
  Baby,
  Scissors,
  Gift,
  Shirt,
  Recycle,
  Trees,
  Fish,
  Shield,
  Flame,
  AlertCircle,
  Clock,
  Heart,
  Camera,
  Laptop,
  FileText,
  Share2,
  Truck,
  Home,
  Box,
  Utensils,
  ShoppingBag,
  Briefcase,
  Building2,
  Building,
  Coffee,
  Cat,
  Sun,
  Cpu,
  HelpCircle
} from 'lucide-react';

interface CategoryIconProps {
  name?: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name = 'Wrench', className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Wrench': return <Wrench className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Droplets': return <Droplets className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Paintbrush': return <Paintbrush className={className} />;
    case 'Tv': return <Tv className={className} />;
    case 'Monitor': return <Monitor className={className} />;
    case 'Sprout': return <Sprout className={className} />;
    case 'Flower2': return <Flower2 className={className} />;
    case 'Footprints': return <Footprints className={className} />;
    case 'Hammer': return <Hammer className={className} />;
    case 'Car': return <Car className={className} />;
    case 'Navigation': return <Navigation className={className} />;
    case 'Package': return <Package className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'Palette': return <Palette className={className} />;
    case 'Store': return <Store className={className} />;
    case 'PartyPopper': return <PartyPopper className={className} />;
    case 'Users': return <Users className={className} />;
    case 'HeartHandshake': return <HeartHandshake className={className} />;
    case 'Baby': return <Baby className={className} />;
    case 'Scissors': return <Scissors className={className} />;
    case 'Gift': return <Gift className={className} />;
    case 'Shirt': return <Shirt className={className} />;
    case 'Recycle': return <Recycle className={className} />;
    case 'Trees': return <Trees className={className} />;
    case 'Fish': return <Fish className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'AlertCircle': return <AlertCircle className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Camera': return <Camera className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Share2': return <Share2 className={className} />;
    case 'Truck': return <Truck className={className} />;
    case 'Home': return <Home className={className} />;
    case 'Box': return <Box className={className} />;
    case 'Utensils': return <Utensils className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Building': return <Building className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'Cat': return <Cat className={className} />;
    case 'Sun': return <Sun className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    default: return <HelpCircle className={className} />;
  }
};
