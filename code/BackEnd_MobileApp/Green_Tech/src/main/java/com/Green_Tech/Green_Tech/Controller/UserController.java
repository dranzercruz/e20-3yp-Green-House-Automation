package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.CustomException.UserAlreadyFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.DTO.*;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/auth/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/create")
    public String createUser() {
        return "User created successfully";
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody AuthDTO authDTO) throws UserAlreadyFoundException {
//        try {
            return ResponseEntity.ok(userService.createNewUser(authDTO));

//            return ResponseEntity.ok(new ApiResponse(
//                    "Authentication successful",
//                    user
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(new ApiResponse("Authentication failed", null));
//        }
    }

    @PostMapping("/google-auth")
    public ResponseEntity<ApiResponse> googleAuth(@RequestBody GoogleAuthDto googleAuthDto) {
        try {
            Map<String, Object> obj = userService.handleGoogleAuth(googleAuthDto);
            User user = (User) obj.get("user");
            Date fiveSecondsAgo = new Date(System.currentTimeMillis() - 5000);
            boolean isNewUser = user.getCreatedAt().after(fiveSecondsAgo);

            return ResponseEntity.ok(new GoogleAuthResponse(
                    "Authentication successful",
                    obj,
                    isNewUser ? "REGISTERED" : "LOGIN"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Authentication failed", null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody AuthDTO authDTO) throws UserNotFoundException {
//        try {
//            Map<String, Object> obj = userService.loginUser(authDTO);
//
//            return ResponseEntity.ok(new ApiResponse(
//                    "Authentication successful",
//                    obj
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(new ApiResponse("Authentication failed", null));
//        }
        return ResponseEntity.ok(userService.loginUser(authDTO));
    }

    @GetMapping("/getUser")
    public ResponseEntity<UserResponseDTO> getUser(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
            return ResponseEntity.ok(userService.getUser(auth));
    }

    @PutMapping("/update")
    public ResponseEntity<User> uploadUserImage(@RequestHeader("Authorization") String auth,
                                                @ModelAttribute UserDTO userDto)
                                                throws UserNotFoundException, IOException {
        return ResponseEntity.ok(userService.updateUser(auth, userDto));
    }

    @PutMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestHeader("Authorization") String auth,
                                                 @RequestBody Map<String, String> authData)
                                                 throws UserNotFoundException {

        String response = userService.changePassword(auth, authData);

        if(response.equals("Success")){
            return ResponseEntity.ok(response);
        } else if (response.equals("New password is same")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("New password is same");
        }else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Password not match");
        }
    }

}
