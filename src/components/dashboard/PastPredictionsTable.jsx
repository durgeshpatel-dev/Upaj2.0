import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const pastPredictions = [
  { crop: "Wheat", date: "2024-05-15", predicted: "78", actual: "78", accuracy: "98%" },
  { crop: "Soybeans", date: "2024-04-20", predicted: "50", actual: "52", accuracy: "96%" },
  { crop: "Corn", date: "2024-03-25", predicted: "110", actual: "105", accuracy: "95%" },
  { crop: "Rice", date: "2024-02-10", predicted: "62", actual: "67", accuracy: "90%" },
];

const PastPredictionsTable = () => {
  const getAccuracyColor = (accuracy) => {
    const value = parseInt(accuracy);
    if (value >= 95) return 'text-status-success';
    if (value >= 90) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <Card className="border-border bg-background-card">
      <CardHeader>
        <CardTitle className="text-text-primary text-base">Past Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-text-secondary font-medium">Crop</th>
                <th className="pb-2 text-text-secondary font-medium">Date</th>
                <th className="pb-2 text-text-secondary font-medium">Predicted</th>
                <th className="pb-2 text-text-secondary font-medium">Actual</th>
                <th className="pb-2 text-text-secondary font-medium">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {pastPredictions.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  <td className="py-2 text-text-primary font-medium">{row.crop}</td>
                  <td className="py-2 text-text-secondary">{row.date}</td>
                  <td className="py-2 text-text-primary">{row.predicted} bu/acre</td>
                  <td className="py-2 text-text-primary">{row.actual} bu/acre</td>
                  <td className={`py-2 font-medium ${getAccuracyColor(row.accuracy)}`}>
                    {row.accuracy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PastPredictionsTable;
