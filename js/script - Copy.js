const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Hapus class 'active' dari kartu yang sebelumnya aktif
        document.querySelector('.card.active').classList.remove('active');
        // Tambahkan class 'active' ke kartu yang sedang disentuh
        card.classList.add('active');
    });
});