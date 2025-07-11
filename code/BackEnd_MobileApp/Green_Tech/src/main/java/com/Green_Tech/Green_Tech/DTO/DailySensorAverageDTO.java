package com.Green_Tech.Green_Tech.DTO;

import java.util.Date;

public interface DailySensorAverageDTO {
    Date getDate();
    Double getTemperature();
    Double getHumidity();
    Double getSoilMoisture();
    Double getNitrogenLevel();
    Double getPhosphorusLevel();
    Double getPotassiumLevel();
}
