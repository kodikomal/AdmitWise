import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, HelpCircle, XCircle } from 'lucide-react';

const ChanceBadge = ({ chance, size = 'normal' }) => {
  let badgeClass = 'badge-insufficient';
  let Icon = HelpCircle;
  let label = chance || 'Unknown';

  if (chance === 'High Chance') {
    badgeClass = 'badge-high';
    Icon = CheckCircle2;
  } else if (chance === 'Moderate Chance') {
    badgeClass = 'badge-moderate';
    Icon = AlertCircle;
  } else if (chance === 'Low Chance') {
    badgeClass = 'badge-low';
    Icon = AlertTriangle;
  } else if (chance === 'Not Eligible') {
    badgeClass = 'badge-ineligible';
    Icon = XCircle;
  } else if (chance === 'Insufficient Data') {
    badgeClass = 'badge-insufficient';
    Icon = HelpCircle;
  }

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`badge ${badgeClass}`} style={{ fontSize: size === 'sm' ? '0.7rem' : '0.78rem' }}>
      <Icon size={iconSize} />
      {label}
    </span>
  );
};

export default ChanceBadge;
