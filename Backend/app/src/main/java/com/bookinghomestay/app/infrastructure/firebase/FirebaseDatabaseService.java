package com.bookinghomestay.app.infrastructure.firebase;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Service wrapper cho Firebase Realtime Database operations
 * 
 * Cung cấp các methods tiện lợi để:
 * - Write data (setValueAsync)
 * - Read data (get)
 * - Update data (updateChildrenAsync)
 * - Delete data (removeValueAsync)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FirebaseDatabaseService {

    private final DatabaseReference firebaseDatabase;

    /**
     * Ghi dữ liệu vào Firebase (CREATE hoặc OVERWRITE)
     * 
     * @param path Đường dẫn trong Firebase (vd: "conversations/USER_HOST_HS")
     * @param data Map chứa dữ liệu cần ghi
     * @return CompletableFuture<Void> để có thể đợi operation hoàn thành
     */
    public CompletableFuture<Void> writeData(String path, Map<String, Object> data) {
        CompletableFuture<Void> future = new CompletableFuture<>();

        try {
            firebaseDatabase.child(path).setValueAsync(data).addListener(() -> {
                log.info("✅ Write to Firebase: {}", path);
                future.complete(null);
            }, Runnable::run);
        } catch (Exception e) {
            log.error("❌ Failed to write to Firebase: {}", e.getMessage());
            future.completeExceptionally(new RuntimeException("Lỗi ghi dữ liệu vào Firebase", e));
        }

        return future;
    }

    /**
     * Đọc dữ liệu từ Firebase (READ)
     * 
     * @param path Đường dẫn cần đọc
     * @return CompletableFuture với dữ liệu hoặc null nếu không tồn tại
     */
    public CompletableFuture<Map<String, Object>> readData(String path) {
        CompletableFuture<Map<String, Object>> future = new CompletableFuture<>();

        firebaseDatabase.child(path).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.exists()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> data = (Map<String, Object>) dataSnapshot.getValue();
                    log.info("✅ Read from Firebase: {}", path);
                    future.complete(data);
                } else {
                    log.warn("⚠️ Data not found in Firebase: {}", path);
                    future.complete(null);
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                log.error("❌ Failed to read from Firebase: {}", databaseError.getMessage());
                future.completeExceptionally(new RuntimeException("Lỗi đọc dữ liệu từ Firebase"));
            }
        });

        return future;
    }

    /**
     * Update một phần dữ liệu (không overwrite toàn bộ)
     * 
     * @param path    Đường dẫn cần update
     * @param updates Map chứa các field cần update
     * @return CompletableFuture<Void> để có thể đợi operation hoàn thành
     */
    public CompletableFuture<Void> updateData(String path, Map<String, Object> updates) {
        CompletableFuture<Void> future = new CompletableFuture<>();

        try {
            firebaseDatabase.child(path).updateChildrenAsync(updates).addListener(() -> {
                log.info("✅ Update Firebase: {}", path);
                future.complete(null);
            }, Runnable::run);
        } catch (Exception e) {
            log.error("❌ Failed to update Firebase: {}", e.getMessage());
            future.completeExceptionally(new RuntimeException("Lỗi cập nhật dữ liệu Firebase", e));
        }

        return future;
    }

    /**
     * Xóa dữ liệu từ Firebase
     * 
     * @param path Đường dẫn cần xóa
     */
    public void deleteData(String path) {
        try {
            firebaseDatabase.child(path).removeValueAsync();
            log.info("✅ Delete from Firebase: {}", path);
        } catch (Exception e) {
            log.error("❌ Failed to delete from Firebase: {}", e.getMessage());
            throw new RuntimeException("Lỗi xóa dữ liệu Firebase", e);
        }
    }

    /**
     * Check xem path có tồn tại trong Firebase không
     * 
     * @param path Đường dẫn cần check
     * @return true nếu tồn tại, false nếu không
     */
    public CompletableFuture<Boolean> exists(String path) {
        CompletableFuture<Boolean> future = new CompletableFuture<>();

        firebaseDatabase.child(path).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                future.complete(dataSnapshot.exists());
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(new RuntimeException("Lỗi check dữ liệu Firebase"));
            }
        });

        return future;
    }

    /**
     * Push data với auto-generated key
     * Dùng khi cần Firebase tự tạo unique ID
     * 
     * @param path Đường dẫn parent
     * @param data Dữ liệu cần push
     * @return Generated key
     */
    public String pushData(String path, Map<String, Object> data) {
        try {
            DatabaseReference newRef = firebaseDatabase.child(path).push();
            newRef.setValueAsync(data);
            String key = newRef.getKey();
            log.info("✅ Push to Firebase: {} with key: {}", path, key);
            return key;
        } catch (Exception e) {
            log.error("❌ Failed to push to Firebase: {}", e.getMessage());
            throw new RuntimeException("Lỗi push dữ liệu vào Firebase", e);
        }
    }
}
