import 'package:flutter/material.dart';
import 'package:home_feel/features/auth/data/models/user_info.dart';
import 'package:intl/intl.dart';

class EditProfileScreen extends StatefulWidget {
  final UserInfo? userInfo;
  const EditProfileScreen({super.key, required this.userInfo});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late TextEditingController _nicknameController;
  late TextEditingController _phoneController;
  late TextEditingController _birthdayController;
  bool? _selectedGender;
  bool _isChanged = false;

  @override
  void initState() {
    super.initState();
    _initControllers();
  }

  void _initControllers() {
    _nicknameController = TextEditingController(
      text: widget.userInfo?.userName ?? 'Chưa cập nhật',
    );
    _phoneController = TextEditingController(
      text: widget.userInfo?.phoneNumber ?? 'Chưa cập nhật',
    );
    _birthdayController = TextEditingController(
      text: _formatDate(widget.userInfo?.birthDay),
    );
    _selectedGender = widget.userInfo?.gender;

    [
      _nicknameController,
      _phoneController,
      _birthdayController,
    ].forEach((controller) => controller.addListener(_onChanged));
  }

  String _formatDate(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return '';
    try {
      return DateFormat('dd/MM/yyyy').format(DateTime.parse(isoDate));
    } catch (_) {
      return 'Chưa cập nhật';
    }
  }

  void _onChanged() {
    setState(() {
      _isChanged =
          _nicknameController.text != widget.userInfo?.userName ||
          _phoneController.text != (widget.userInfo?.phoneNumber ?? '') ||
          _birthdayController.text != _formatDate(widget.userInfo?.birthDay) ||
          _selectedGender != widget.userInfo?.gender;
    });
  }

  @override
  void dispose() {
    [
      _nicknameController,
      _phoneController,
      _birthdayController,
    ].forEach((c) => c.dispose());
    super.dispose();
  }

  Future<void> _selectDate() async {
    final defaultDate = DateTime.now().subtract(const Duration(days: 365 * 18));
    final initialDate = widget.userInfo?.birthDay != null
        ? DateTime.tryParse(widget.userInfo!.birthDay!) ?? defaultDate
        : defaultDate;

    final picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(1900),
      lastDate: defaultDate,
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(
            primary: Color(0xFFFF6D00), // Màu cam chủ đạo
          ),
        ),
        child: child!,
      ),
    );

    if (picked != null) {
      _birthdayController.text = DateFormat('dd/MM/yyyy').format(picked);
    }
  }

  void _updateProfile() {
    // Xử lý cập nhật ở đây
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Cập nhật thành công'),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        backgroundColor: const Color(0xFFFF6D00),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: Color(0xFFFF6D00),
        ),
      ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    bool enabled = true,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle(label),
          TextField(
            controller: controller,
            enabled: enabled,
            decoration: InputDecoration(
              filled: true,
              fillColor: enabled ? Colors.white : Colors.grey[100],
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(
                  color: Color(0xFFE0E0E0), // Màu viền xám nhạt
                  width: 1.0,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(
                  color: Color(0xFFE0E0E0),
                  width: 1.0,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(
                  color: Color(0xFFFF6D00), // Viền cam khi focus
                  width: 1.5,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 14,
              ),
            ),
            style: const TextStyle(fontSize: 15),
          ),
        ],
      ),
    );
  }

  Widget _buildDateField() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle('Ngày sinh'),
          GestureDetector(
            onTap: _selectDate,
            child: AbsorbPointer(
              child: TextField(
                controller: _birthdayController,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(
                      color: Color(0xFFE0E0E0),
                      width: 1.0,
                    ),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(
                      color: Color(0xFFE0E0E0),
                      width: 1.0,
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(
                      color: Color(0xFFFF6D00),
                      width: 1.5,
                    ),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                  suffixIcon: const Icon(
                    Icons.calendar_today,
                    color: Color(0xFFFF6D00),
                  ),
                ),
                style: const TextStyle(fontSize: 15),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGenderField() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle('Giới tính'),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE0E0E0), width: 1.0),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Row(
              children: [
                Expanded(
                  child: RadioListTile<bool>(
                    title: const Text('Nam', style: TextStyle(fontSize: 15)),
                    value: true,
                    groupValue: _selectedGender,
                    onChanged: (value) =>
                        setState(() => _selectedGender = value),
                    activeColor: const Color(0xFFFF6D00),
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                  ),
                ),
                Expanded(
                  child: RadioListTile<bool>(
                    title: const Text('Nữ', style: TextStyle(fontSize: 15)),
                    value: false,
                    groupValue: _selectedGender,
                    onChanged: (value) =>
                        setState(() => _selectedGender = value),
                    activeColor: const Color(0xFFFF6D00),
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Chỉnh sửa hồ sơ',
          style: TextStyle(color: Colors.black87, fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFFFF6D00)),
        centerTitle: true,
      ),
      body: Container(
        color: const Color(0xFFF5F5F5),
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                  border: Border.all(
                    color: const Color(0xFFEEEEEE),
                    width: 1.0,
                  ),
                ),
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    _buildTextField('Nickname', _nicknameController),
                    const SizedBox(height: 8),
                    _buildTextField('Số điện thoại', _phoneController),
                    const SizedBox(height: 8),
                    _buildGenderField(),
                    const SizedBox(height: 8),
                    _buildDateField(),
                    const SizedBox(height: 8),
                    _buildTextField(
                      'Email',
                      TextEditingController(text: widget.userInfo?.email),
                      enabled: false,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isChanged ? _updateProfile : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFF6D00),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: Text(
                    'CẬP NHẬT',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
