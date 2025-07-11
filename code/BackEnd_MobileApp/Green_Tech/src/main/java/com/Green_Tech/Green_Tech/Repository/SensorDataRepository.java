package com.Green_Tech.Green_Tech.Repository;

import com.Green_Tech.Green_Tech.DTO.DailySensorAverageDTO;
import com.Green_Tech.Green_Tech.Entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
@EnableJpaRepositories
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    SensorData findFirstByOrderByIdDesc();
    SensorData findFirstByDeviceIdOrderByIdDesc(Long id);
    void deleteAllByDeviceId(Long id);
    @Query("SELECT " +
            "FUNCTION('DATE', s.updatedAt) as date, " +
            "ROUND(AVG(s.temperature), 2) as temperature, " +
            "ROUND(AVG(s.humidity), 2) as humidity, " +
            "ROUND(AVG(s.soilMoisture), 2) as soilMoisture, " +
            "ROUND(AVG(s.nitrogenLevel), 2) as nitrogenLevel, " +
            "ROUND(AVG(s.phosphorusLevel), 2) as phosphorusLevel, " +
            "ROUND(AVG(s.potassiumLevel), 2) as potassiumLevel " +
            "FROM SensorData s " +
            "WHERE s.device.id = :id AND s.updatedAt BETWEEN :start AND :end " +
            "GROUP BY FUNCTION('DATE', s.updatedAt) " +
            "ORDER BY FUNCTION('DATE', s.updatedAt)")
    List<DailySensorAverageDTO> findByIdAndDateRange(@Param("id") Long id, @Param("start") Date start,
                                                     @Param("end") Date end);
}
