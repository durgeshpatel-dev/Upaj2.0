import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'

const pastPredictions = [
  ["2023-08-15", "Corn", "150 bushels/acre"],
  ["2023-06-20", "Soybeans", "50 bushels/acre"],
  ["2023-10-01", "Wheat", "80 bushels/acre"],
]

const PastPredictionsList = () => {
  return (
    <Card className="border-border bg-background-card">
      <CardHeader>
        <CardTitle className="text-text-primary text-lg">Past Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg ring-1 ring-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-background text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Crop</th>
                <th className="px-4 py-3 font-medium">Predicted Yield</th>
              </tr>
            </thead>
            <tbody>
              {pastPredictions.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-text-primary">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default PastPredictionsList
