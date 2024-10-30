import React from 'react';

const coordinatesToCity = {
    "139.691700,35.689500": "東京",
    "135.502300,34.693700": "大阪",
    "141.354500,43.061800": "札幌",
    "136.906600,35.181500": "名古屋",
    "130.401700,33.590400": "福岡",
    "140.872100,38.268800": "仙台",
    "132.455300,34.385300": "広島",
    "136.656200,36.578100": "金沢",
    "127.681100,26.212500": "那覇",
    "130.557100,31.596600": "鹿児島"
};

const WeatherTable = ({ weatherData }) => {
    if (!weatherData) {
        return <p>天気情報を取得中...</p>;
    }

    const cityWeatherSummary = weatherData.Feature.map((item) => {
        const coordinates = item.Geometry.Coordinates;
        const city = coordinatesToCity[coordinates] || "不明な場所";
        const weatherList = item.Property.WeatherList.Weather;

        let observationWeather = "不明"; 
        let forecastWeather = "不明";

        // 観測の降水量をチェック
        const observation = weatherList.find(weather => weather.Type === "observation");
        if (observation) {
            observationWeather = observation.Rainfall === 0 ? "晴れ" : "雨";
        }

        // 予測の降水量をチェック
        const forecast = weatherList.find(weather => weather.Type === "forecast" && weather.Rainfall > 0);
        if (forecast) {
            forecastWeather = "雨かも";
        } else {
            forecastWeather = "晴れ";
        }

        return {
            city,
            type: observation ? "観測" : "予測",
            weather: observationWeather === "晴れ" ? observationWeather : forecastWeather
        };
    });

    return (
        <div>
            <h2>全国の天気情報</h2>
            <table>
                <thead>
                    <tr>
                        <th>場所</th>
                        <th>タイプ</th>
                        <th>天気</th>
                    </tr>
                </thead>
                <tbody>
                    {cityWeatherSummary.map((summary, index) => (
                        <tr key={index}>
                            <td>{summary.city}</td>
                            <td>{summary.type}</td>
                            <td>{summary.weather}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WeatherTable;
