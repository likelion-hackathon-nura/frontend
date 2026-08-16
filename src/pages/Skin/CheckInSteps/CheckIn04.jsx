import React, { useEffect, useState } from 'react'

import './CheckIn04.css'

const CheckIn04 = ({ isComplete, onNext }) => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (isComplete) {
            setProgress(100)
            return
        }

        const interval = setInterval(() => setProgress(prev => Math.min(prev + 2, 90)), 100)
        return () => clearInterval(interval)
    }, [isComplete])

    useEffect(() => {
        if (progress !== 100) return

        const timer = setTimeout(() => {
            onNext()
        }, 500)

        return () => clearTimeout(timer)
    }, [progress, onNext])

    return (
        <div className="checkin04_wrap">
            <div
                className="analysis_progress"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
            >
                <div
                    className="analysis_progress_fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="analysis_text">
                업로드 해주신 사진을<br />분석 중이에요...
            </p>
        </div>
    )
}

export default CheckIn04
