import 'package:flutter/material.dart';

class PaymentMethod {
  final String id;
  final String name;
  final IconData icon;
  final String? promotionText;
  final Color iconColor;

  PaymentMethod({
    required this.id,
    required this.name,
    required this.icon,
    this.promotionText,
    required this.iconColor,
  });
}

class PaymentMethodsScreen extends StatefulWidget {
  final Function(String) onSelectPaymentMethod;

  const PaymentMethodsScreen({Key? key, required this.onSelectPaymentMethod})
    : super(key: key);

  @override
  State<PaymentMethodsScreen> createState() => _PaymentMethodsScreenState();
}

class _PaymentMethodsScreenState extends State<PaymentMethodsScreen> {
  String _selectedMethodId = '';
  bool _agreedToTerms = false;

  @override
  Widget build(BuildContext context) {
    // Danh sách các phương thức thanh toán
    final paymentMethods = [
      PaymentMethod(
        id: 'momo',
        name: 'Ví MoMo',
        icon: Icons.account_balance_wallet,
        iconColor: Colors.pink,
      ),
      PaymentMethod(
        id: 'zalopay',
        name: 'Ví ZaloPay',
        icon: Icons.account_balance_wallet,
        promotionText: 'Nhập mã HFZALOPAY để được giảm giá cho đơn từ 150K',
        iconColor: Colors.blue,
      ),
      PaymentMethod(
        id: 'shopeepay',
        name: 'Ví ShopeePay',
        icon: Icons.account_balance_wallet,
        promotionText: 'Ưu đãi ShopeePay giảm đến 50.000đ',
        iconColor: Colors.orange,
      ),
      PaymentMethod(
        id: 'credit',
        name: 'Thẻ Credit',
        icon: Icons.credit_card,
        iconColor: Colors.green,
      ),
      PaymentMethod(
        id: 'atm',
        name: 'Thẻ ATM',
        icon: Icons.credit_card,
        iconColor: Colors.blue.shade800,
      ),
      PaymentMethod(
        id: 'cash',
        name: 'Trả tại khách sạn',
        icon: Icons.home,
        promotionText: 'Khách sạn có thể hủy phòng tùy theo tình trạng phòng',
        iconColor: Colors.orange.shade700,
      ),
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Phương thức thanh toán',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Text(
                    'Lựa chọn phương thức thanh toán',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade800,
                    ),
                  ),
                ),
                const Divider(height: 1),
                // Danh sách phương thức thanh toán
                ListView.separated(
                  physics: const NeverScrollableScrollPhysics(),
                  shrinkWrap: true,
                  padding: EdgeInsets.zero,
                  itemCount: paymentMethods.length,
                  separatorBuilder: (context, index) =>
                      const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final method = paymentMethods[index];
                    final isSelected = _selectedMethodId == method.id;
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ListTile(
                          leading: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: method.iconColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(
                              method.icon,
                              color: method.iconColor,
                              size: 20,
                            ),
                          ),
                          title: Text(
                            method.name,
                            style: TextStyle(
                              fontWeight: isSelected
                                  ? FontWeight.w600
                                  : FontWeight.w500,
                              fontSize: 16,
                              color: isSelected
                                  ? method.iconColor
                                  : Colors.black87,
                            ),
                          ),
                          trailing: Radio<String>(
                            value: method.id,
                            groupValue: _selectedMethodId,
                            activeColor: method.iconColor,
                            onChanged: (value) {
                              setState(() {
                                _selectedMethodId = value ?? '';
                              });
                            },
                          ),
                          tileColor: isSelected
                              ? method.iconColor.withOpacity(0.05)
                              : null,
                          onTap: () {
                            setState(() {
                              _selectedMethodId = method.id;
                            });
                          },
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                        ),
                        if (method.promotionText != null)
                          Container(
                            margin: const EdgeInsets.only(
                              left: 72,
                              right: 16,
                              bottom: 12,
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: method.id == 'zalopay'
                                  ? Colors.blue.shade50
                                  : method.id == 'shopeepay'
                                  ? Colors.orange.shade50
                                  : Colors.grey.shade50,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              method.promotionText!,
                              style: TextStyle(
                                fontSize: 12,
                                color: method.id == 'zalopay'
                                    ? Colors.blue.shade700
                                    : method.id == 'shopeepay'
                                    ? Colors.orange.shade700
                                    : Colors.grey.shade700,
                              ),
                            ),
                          ),
                      ],
                    );
                  },
                ),

                // Phần đồng ý điều khoản
                Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Điều khoản và Chính sách',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade800,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Bằng việc chọn "Xác nhận", bạn đồng ý với các điều khoản đặt phòng, chính sách hủy phòng và phương thức thanh toán được lựa chọn.',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade700,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Checkbox(
                            value: _agreedToTerms,
                            onChanged: (value) {
                              setState(() {
                                _agreedToTerms = value ?? false;
                              });
                            },
                            activeColor: Colors.orange.shade700,
                          ),
                          Expanded(
                            child: GestureDetector(
                              onTap: () {
                                setState(() {
                                  _agreedToTerms = !_agreedToTerms;
                                });
                              },
                              child: RichText(
                                text: TextSpan(
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey.shade800,
                                  ),
                                  children: [
                                    const TextSpan(text: 'Tôi đồng ý với '),
                                    TextSpan(
                                      text: 'Điều khoản và Chính sách',
                                      style: TextStyle(
                                        color: Colors.orange.shade700,
                                        fontWeight: FontWeight.w500,
                                        decoration: TextDecoration.underline,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Bottom button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  offset: const Offset(0, -1),
                  blurRadius: 5,
                ),
              ],
            ),
            child: ElevatedButton(
              onPressed: (_selectedMethodId.isNotEmpty && _agreedToTerms)
                  ? () {
                      // Find the selected method name
                      final methodName = paymentMethods
                          .firstWhere((m) => m.id == _selectedMethodId)
                          .name;
                      widget.onSelectPaymentMethod(methodName);
                      // Không cần pop ở đây vì sẽ được xử lý ở BookingCreateScreen
                      // Navigator.pop(context);
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange.shade700,
                foregroundColor: Colors.white,
                disabledBackgroundColor: Colors.grey.shade300,
                disabledForegroundColor: Colors.grey.shade500,
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Xác nhận',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
