import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Users } from 'lucide-react';
import type { Package } from '../../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PackageCardProps {
  package: Package;
  onBook: (packageId: string) => void;
}

export const PackageCard = ({ package: pkg, onBook }: PackageCardProps) => {
  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium font-body">
            {pkg.tier}
          </span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">{pkg.name}</h3>
          <p className="text-gray-600 text-sm mb-3 font-body">{pkg.shortDescription}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span className="font-body">{pkg.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="font-body">{pkg.targetAudience.split(',')[0]}</span>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2 font-heading">Includes:</h4>
          <ul className="space-y-1">
            {pkg.features.slice(0, 3).map((feature: string, index: number) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="font-body">{feature}</span>
              </li>
            ))}
            {pkg.features.length > 3 && (
              <li className="text-sm text-gray-500 font-body">
                +{pkg.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900 font-heading">
              ${pkg.price}
            </span>
            <span className="text-gray-500 font-body">per person</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => onBook(pkg.id)}
            className="flex-1"
          >
            Book Now
          </Button>
          <Link
            to={`/packages/${pkg.id}`}
            className="flex-1 inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500 px-4 py-2 text-base font-body"
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
