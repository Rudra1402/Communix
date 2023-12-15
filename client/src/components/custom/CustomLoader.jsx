import classNames from 'classnames'
import React from 'react'
import CustomCard from './CustomCard'

function CustomLoader({
    rows = 3,
    height,
    width,
    className,
    rowClass
}) {
    return (
        <CustomCard className={classNames('flex gap-4 items-center w-full h-full', className)}>
            {Array(rows).fill(0).map((row, index) => (
                <div
                    key={index}
                    className={classNames('bg-[#fff3] rounded', rowClass)}
                    style={{ height: height, width: width }}
                ></div>
            ))}
        </CustomCard>
    )
}

export default CustomLoader