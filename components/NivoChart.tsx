import React from 'react';
import { ResponsivePie } from '@nivo/pie';



const NivoPieChart = ({ name, value, secondValue, height, top, bottom, style }: { name: string, value: number, secondValue: number, height: number, top: number, bottom: number, style?: string }) => {
    const data = [
        {
            id: name,
            label: name,
            value: value,
            color: 'hsl(0, 0%, 8%)',
        },
        {
            id: 'Others',
            label: 'Others',
            value: secondValue,
            color: 'hsl(0, 0%, 91%)',
        },
    ];

    return (
        <div style={{ height: height }} className={`${style}`}>
            <ResponsivePie
                data={data}
                margin={{ top: top, bottom: bottom, right: 70, left: 30 }}
                colors={({ data }) => data.color}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]],
                }}
                arcLabelsSkipAngle={0} // Ensures all labels are displayed
                arcLabelsTextColor="#00000"
                tooltip={() => null} // Disable tooltip
                enableArcLabels // Keep arc labels only
                arcLabelsRadiusOffset={10} // Move the labels outward if needed
                arcLinkLabelsThickness={3}
                arcLinkLabelsColor={{ from: 'color' }}
                theme={{
                    labels: {
                        text: {
                            fontSize: 14,
                            fontWeight: 600,
                        },

                    },
                }}
            />
        </div>
    );
};

export default NivoPieChart;
