import React from 'react';
import HomeCardI from './HomeCard';
import DonationCardI from './DonationCard';
import BloodDonationCardI from './BloodDonationCard';
import NationalBloodDonationI from './NationalBloodDonation';
import StoreDonationCardI from './StoreDonationCard';
const HomeCard = props => <HomeCardI {...props} />;
const DonationCard = props => <DonationCardI {...props} />;
const BloodDonationCard = props => <BloodDonationCardI {...props} />;
const NationalBloodDonation = props => <NationalBloodDonationI {...props} />;
const StoreDonationCard = props => <StoreDonationCardI {...props} />;
export default {
  HomeCard,
  DonationCard,
  BloodDonationCard,
  NationalBloodDonation,
  StoreDonationCard
};
