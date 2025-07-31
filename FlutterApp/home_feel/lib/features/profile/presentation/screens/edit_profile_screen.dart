import 'package:flutter/material.dart';
import 'package:home_feel/features/auth/data/models/user_info.dart';
import 'package:intl/intl.dart';

class EditProfileScreen extends StatefulWidget {
  final UserInfo userInfo;
  const EditProfileScreen({super.key, required this.userInfo});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late TextEditingController _nicknameController;
  late TextEditingController _phoneController;
  late TextEditingController _birthdayController;

  bool? _selectedGender; // true = Nam, false = Nữ
  bool _isChanged = false;

  @override
  void initState() {
    super.initState();
    _nicknameController = TextEditingController(text: widget.userInfo.userName);
    _phoneController = TextEditingController(
      text: widget.userInfo.phoneNumber ?? '',
    );
    _birthdayController = TextEditingController(
      text: _formatDate(widget.userInfo.birthDay),
    );
    _selectedGender = widget.userInfo.gender;

    _nicknameController.addListener(_onChanged);
    _phoneController.addListener(_onChanged);
    _birthdayController.addListener(_onChanged);
  }

  String _formatDate(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return '';
    try {
      final date = DateTime.parse(isoDate);
      return DateFormat('dd/MM/yyyy').format(date);
    } catch (_) {
      return '';
    }
  }

  void _onChanged() {
    final isBirthDayChanged =
        _birthdayController.text != _formatDate(widget.userInfo.birthDay);
    final isGenderChanged = _selectedGender != widget.userInfo.gender;
    final isNickNameChanged =
        _nicknameController.text != widget.userInfo.userName;
    final isPhoneChanged =
        _phoneController.text != (widget.userInfo.phoneNumber ?? '');

    setState(() {
      _isChanged =
          isNickNameChanged ||
          isPhoneChanged ||
          isBirthDayChanged ||
          isGenderChanged;
    });
  }

  @override
  void dispose() {
    _nicknameController.dispose();
    _phoneController.dispose();
    _birthdayController.dispose();
    super.dispose();
  }

  void _updateProfile() {
    // Gửi event Bloc hoặc gọi usecase cập nhật ở đây
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Cập nhật thành công')));
  }

  Widget _buildField(
    String label,
    TextEditingController controller, {
    bool enabled = true,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          enabled: enabled,
          readOnly: !enabled,
          decoration: const InputDecoration(
            hintText: 'Chưa cập nhật',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildDateField(String label, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
        const SizedBox(height: 4),
        GestureDetector(
          onTap: _selectDate,
          child: AbsorbPointer(
            child: TextField(
              controller: controller,
              readOnly: true,
              decoration: const InputDecoration(
                hintText: 'Chưa cập nhật',
                border: OutlineInputBorder(),
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Future<void> _selectDate() async {
    final now = DateTime.now();
    final initialDate = widget.userInfo.birthDay != null
        ? DateTime.tryParse(widget.userInfo.birthDay!) ??
              DateTime(now.year - 18)
        : DateTime(now.year - 18);

    final firstDate = DateTime(1900);
    final lastDate = DateTime(now.year - 18, now.month, now.day);

    final picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: firstDate,
      lastDate: lastDate,
      helpText: 'Chọn ngày sinh',
      cancelText: 'HỦY',
      confirmText: 'OK',
      locale: const Locale('vi', 'VN'),
      builder: (context, child) {
        return Theme(
          data: ThemeData(
            colorScheme: ColorScheme.light(primary: Colors.orange),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      final formatted = DateFormat('dd/MM/yyyy').format(picked);
      _birthdayController.text = formatted;
      _onChanged();
    }
  }

  Widget _buildGenderField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Giới tính', style: TextStyle(fontWeight: FontWeight.w500)),
        const SizedBox(height: 4),
        Row(
          children: [
            Expanded(
              child: RadioListTile<bool>(
                title: const Text('Nam'),
                value: true,
                groupValue: _selectedGender,
                onChanged: (value) {
                  setState(() {
                    _selectedGender = value;
                    _onChanged();
                  });
                },
              ),
            ),
            Expanded(
              child: RadioListTile<bool>(
                title: const Text('Nữ'),
                value: false,
                groupValue: _selectedGender,
                onChanged: (value) {
                  setState(() {
                    _selectedGender = value;
                    _onChanged();
                  });
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sửa hồ sơ')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            _buildField('Nickname', _nicknameController),
            _buildField('Số điện thoại', _phoneController),
            _buildGenderField(), 
            _buildDateField('Ngày sinh', _birthdayController),
            _buildField(
              'Email',
              TextEditingController(text: widget.userInfo.email),
              enabled: false,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isChanged ? _updateProfile : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: _isChanged ? Colors.orange : Colors.grey,
              ),
              child: const Text('Cập nhật'),
            ),
          ],
        ),
      ),
    );
  }
}
