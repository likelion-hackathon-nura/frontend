import React, { useEffect, useState } from 'react'

import './CheckIn04.css'

const CheckIn04 = ({ onNext }) => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const nextProgress = Math.min(prev + 2, 100)

                if (nextProgress === 100) {
                    clearInterval(interval)
                }

                return nextProgress
            })
        }, 100)

        return () => clearInterval(interval)
    }, [])

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
