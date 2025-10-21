import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './components/Logo';

const LandingPage = ({ onGoToLogin, onGoToRegister, isLoggedIn, onLogout, onGoHome }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const openMap = () => {
    const url = 'https://maps.google.com/?q=APAE+Campinas';
    Linking.openURL(url);
  };

  const openWhatsApp = () => {
    const url = 'https://wa.me/5519999999999';
    Linking.openURL(url);
  };

  const openPhone = () => {
    const url = 'tel:+5519999999999';
    Linking.openURL(url);
  };

  const openEmail = () => {
    const url = 'mailto:contato@apaecampinas.org.br';
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header Fixo */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoSection}>
            <Logo size="small" variant="light" />
          </View>
          
          <View style={styles.headerActions}>
            {isLoggedIn ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.returnHomeButton} onPress={onGoHome}>
                  <Ionicons name="home" size={18} color="#ffffff" />
                  <Text style={styles.returnHomeText}>Início</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuButton, { marginLeft: 8 }]} onPress={() => setMenuOpen(!menuOpen)}>
                  <Ionicons name={menuOpen ? 'close' : 'menu'} size={24} color="#374151" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.authButtons}>
                <TouchableOpacity style={styles.registerHeaderButton} onPress={onGoToRegister}>
                  <Text style={styles.registerHeaderText}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginHeaderButton} onPress={onGoToLogin}>
                  <Text style={styles.loginHeaderText}>Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Menu Mobile Overlay */}
      {menuOpen && isLoggedIn && (
        <Modal visible={menuOpen} transparent animationType="fade">
          <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
            <View style={styles.menuContent}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); setMapModalOpen(true); }}>
                <Ionicons name="location" size={20} color="#374151" />
                <Text style={styles.menuItemText}>Sede Campinas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); setContactModalOpen(true); }}>
                <Ionicons name="call" size={20} color="#374151" />
                <Text style={styles.menuItemText}>Contato</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); onLogout(); }}>
                <Ionicons name="log-out" size={20} color="#dc2626" />
                <Text style={[styles.menuItemText, { color: '#dc2626' }]}>Sair</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image 
            source={require('../assets/banner-hero.jpg.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
            style={styles.heroOverlay}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Um espaço seguro para auxiliar pessoas importantes</Text>
            </View>
          </View>
        </View>

        {/* Quem Somos Section */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <View style={styles.textContent}>
              <Text style={styles.sectionTitle}>Quem somos?</Text>
              <Text style={styles.sectionText}>
                A Apae Brasil é uma das maiores redes do mundo de apoio a pessoas com deficiência intelectual e múltipla. Com mais de 2.200 unidades em todo o país, oferecemos atendimento integral em saúde, educação e assistência social. Nosso pioneirismo, capilaridade e a confiança da sociedade fazem da Rede Apae a maior rede de inclusão para todos.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image 
                source={require('../assets/quem-somos.jpg.jpg')}
                style={styles.sectionImageLarge}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Nossa Plataforma Section */}
        <View style={styles.platformSection}>
          <View style={styles.sectionContent}>
            <View style={styles.imageContainer}>
              <Image 
                source={require('../assets/nossa-plataforma.jpg.jpg')}
                style={styles.sectionImageLarge}
                resizeMode="cover"
              />
            </View>
            <View style={styles.textContent}>
              <Text style={[styles.sectionTitle, { color: '#ffffff' }]}>Nossa plataforma</Text>
              <Text style={[styles.sectionText, { color: '#ffffff' }]}>
                A Apae Brasil lidera o maior modelo da América Latina. Oferecemos um atendimento completo para pessoas com deficiência intelectual e suas famílias. Nossa plataforma digital permite o acesso fácil a serviços essenciais, informações e uma comunidade de apoio. Estamos comprometidos em promover a inclusão social e a qualidade de vida para todos.
              </Text>
            </View>
          </View>
        </View>



        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerBrand}>
              <Logo size="medium" variant="light" />
              <Text style={styles.footerSubtitle}>Inclusão para todos</Text>
            </View>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => setContactModalOpen(true)}>
                <Text style={styles.footerLink}>Contato</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMapModalOpen(true)}>
                <Text style={styles.footerLink}>Localização</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.footerCopyright}>© 2024 APAE Brasil. Todos os direitos reservados.</Text>
        </View>
      </ScrollView>

      {/* Modal do Mapa */}
      <Modal visible={mapModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>APAE Campinas</Text>
              <TouchableOpacity onPress={() => setMapModalOpen(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.mapPlaceholder}>
                <Ionicons name="location" size={48} color="#15803d" />
                <Text style={styles.mapText}>APAE Campinas</Text>
                <Text style={styles.mapAddress}>Rua Example, 123 - Campinas, SP</Text>
              </View>
              <TouchableOpacity style={styles.mapButton} onPress={openMap}>
                <Ionicons name="navigate" size={20} color="#ffffff" />
                <Text style={styles.mapButtonText}>Abrir no Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Contato */}
      <Modal visible={contactModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Entre em Contato</Text>
              <TouchableOpacity onPress={() => setContactModalOpen(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <TouchableOpacity style={styles.contactItem} onPress={openPhone}>
                <Ionicons name="call" size={24} color="#15803d" />
                <Text style={styles.contactText}>(19) 9999-9999</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem} onPress={openWhatsApp}>
                <Ionicons name="logo-whatsapp" size={24} color="#25d366" />
                <Text style={styles.contactText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
                <Ionicons name="mail" size={24} color="#15803d" />
                <Text style={styles.contactText}>contato@apaecampinas.org.br</Text>
              </TouchableOpacity>
              <View style={styles.contactItem}>
                <Ionicons name="location" size={24} color="#15803d" />
                <Text style={styles.contactText}>Rua Example, 123 - Campinas, SP</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoSection: {
    backgroundColor: '#15803d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  registerHeaderButton: {
    backgroundColor: '#15803d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  registerHeaderText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  loginHeaderButton: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginHeaderText: {
    color: '#15803d',
    fontWeight: '600',
  },
  returnHomeButton: {
    backgroundColor: '#15803d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  returnHomeText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  menuButton: {
    padding: 8,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContent: {
    backgroundColor: '#ffffff',
    marginTop: 100,
    marginRight: 20,
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    height: 300,
    backgroundColor: '#15803d',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
  },
  heroTextContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#15803d',
    textAlign: 'left',
    lineHeight: 28,
  },
  section: {
    paddingVertical: 40,
  },
  sectionContent: {
    paddingHorizontal: 20,
  },
  textContent: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: 'center',
  },
  sectionImageLarge: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  platformSection: {
    backgroundColor: '#15803d',
    paddingVertical: 40,
  },

  footer: {
    backgroundColor: '#1f2937',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  footerBrand: {
    flex: 1,
  },

  footerSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  footerLinks: {
    alignItems: 'flex-end',
  },
  footerLink: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
  },
  mapPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 20,
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  mapAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  mapButton: {
    backgroundColor: '#15803d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
  },
});

export default LandingPage;