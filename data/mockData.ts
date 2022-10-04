/* eslint-disable camelcase */
import { LibraryData } from '../src/context/librariesContext';

const mockLibraries: LibraryData[] = [
  {
    areas: {
      focus: ['06475'],
      service: [],
    },
    basic_info: {
      description: 'Serving Old Saybrook, CT',
      internal_urn: '',
      name: 'Acton Public Library',
      number_of_patrons: '9',
      online_registration: '',
      pls_id: '',
      short_name: 'CTACTN',
      timestamp: '',
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
    urls_and_contact: {
      authentication_url:
        'https://lion.lyrasistechnology.org/acton/authentication_document',
      contact_email: 'actonlibrary@actonlibrary.org',
      contact_validated: '',
      copyright_email: 'actonlibrary@actonlibrary.org',
      copyright_validated: '',
      help_email: 'actonlibrary@actonlibrary.org',
      help_validated: '',
      opds_url: 'https://lion.lyrasistechnology.org/acton/',
      web_url: 'http://www.actonlibrary.org/',
    },
    uuid: '1',
  },
  {
    areas: {
      focus: ['Maricopa, AZ'],
      service: [],
    },
    basic_info: {
      description: 'Serving the needs of library users in Arizona',
      internal_urn: '',
      name: 'Ak-Chin Indian Community Library, AZ',
      number_of_patrons: '5',
      online_registration: '',
      pls_id: '',
      short_name: 'LVYZVC',
      timestamp: '',
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye.amigos.org/azakchinindiancommunity/authentication_document',
      contact_email: 'simplye@amigos.org',
      contact_validated: '',
      copyright_email: 'library@ak-chin.nsn.us',
      copyright_validated: '',
      help_email: 'library@ak-chin.nsn.us',
      help_validated: '',
      opds_url: 'https://simplye.amigos.org/azakchinindiancommunity/',
      web_url:
        'https://ak-chin.nsn.us/index.php/departments/membership-services',
    },
    uuid: '2',
  },
  {
    areas: {
      focus: [],
      service: [],
    },
    basic_info: {
      description: 'Infinite possibilities',
      internal_urn: '',
      name: 'Alameda County Library',
      number_of_patrons: '1839',
      online_registration: '',
      pls_id: '',
      short_name: 'CALMDA',
      timestamp: '',
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
    urls_and_contact: {
      authentication_url:
        'http://acl.simplye-ca.org/CALMDA/authentication_document',
      contact_email: 'pmackinnon@califa.org',
      contact_validated: '',
      copyright_email: 'simplye@aclibrary.org',
      copyright_validated: '',
      help_email: 'simplye@aclibrary.org',
      help_validated: '',
      opds_url: 'http://acl.simplye-ca.org/CALMDA/',
      web_url: 'http://aclibrary.org/',
    },
    uuid: '3',
  },
  {
    areas: {
      focus: ['Jim Wells County, TX', 'Alice, TX'],
      service: [],
    },

    basic_info: {
      description:
        'Serving the needs of library users in Jim Wells County, Texas',
      internal_urn: '',
      name: 'Alicia Salinas City of Alice Public Library, TX',
      number_of_patrons: '2',
      online_registration: '',
      pls_id: '',
      short_name: 'JEVRCG',
      timestamp: '',
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txaliciasalinascityofalicepublic/authentication_document',
      contact_email: 'simplye@amigos.org',
      contact_validated: '',
      copyright_email: 'library@cityofalice.org',
      copyright_validated: '',
      help_email: 'library@cityofalice.org',
      help_validated: '',
      opds_url:
        'https://simplye-tsl1.amigos.org/txaliciasalinascityofalicepublic/',
      web_url: 'http://www.cityofalice.org/179/Library',
    },

    uuid: '4',
  },
  {
    areas: {
      focus: ['Jim Wells County, TX', 'Alice, TX'],
      service: [],
    },

    basic_info: {
      description: 'Serving Woodville, TX',
      internal_urn: '',
      name: 'Allan Shivers Library & Museum, TX',
      number_of_patrons: '0',
      online_registration: '',
      pls_id: '',
      short_name: 'JEVRCG',
      timestamp: '',
    },

    stages: {
      library_stage: 'testing',
      registry_stage: 'testing',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txallanshiverslibrarymuseum/authentication_document',
      contact_email: 'simplye@amigos.org',
      contact_validated: '',
      copyright_email: 'ashivers.library@yahoo.com',
      copyright_validated: '',
      help_email: 'ashivers.library@yahoo.com',
      help_validated: '',
      opds_url: 'https://simplye-tsl1.amigos.org/txallanshiverslibrarymuseum/',
      web_url: 'https://www.allanshiverslibrary.com/',
    },

    uuid: '5',
  },
  {
    areas: {
      focus: ['Everywhere'],
      service: [],
    },

    basic_info: {
      description: 'Serving patrons of Maryland',
      internal_urn: '',
      name: 'Allegany County Library System',
      number_of_patrons: '0',
      online_registration: '',
      pls_id: '',
      short_name: 'JGSVTQ',
      timestamp: '',
    },
    stages: {
      library_stage: 'testing',
      registry_stage: 'cancelled',
    },
    urls_and_contact: {
      authentication_url:
        'https://allegany.simplye-md.org/MDALLEGANY/authentication_document',
      contact_email: 'alleganycountylibrary@alleganycountylibrary.info',
      contact_validated: '',
      copyright_email: 'alleganycountylibrary@alleganycountylibrary.info',
      copyright_validated: '',
      help_email: 'alleganycountylibrary@alleganycountylibrary.info',
      help_validated: '',
      opds_url: 'https://allegany.simplye-md.org/MDALLEGANY/',
      web_url: 'http://www.alleganycountylibrary.info/',
    },

    uuid: '6',
  },
  {
    areas: {
      focus: ['Hawkins, TX'],
      service: [],
    },

    basic_info: {
      description: 'Open a book, open a mind. Knowledge is power.',
      internal_urn: '',
      name: 'Allen Memorial Public Library, TX',
      number_of_patrons: '9',
      online_registration: '',
      pls_id: '',
      short_name: 'UOVOCB',
      timestamp: '',
    },

    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txallenmemorial/authentication_document',
      contact_email: 'simplye@amigos.org',
      contact_validated: '',
      copyright_email: 'hawkins.library@yahoo.com',
      copyright_validated: '',
      help_email: 'hawkins.library@yahoo.com',
      help_validated: '',
      opds_url: 'https://simplye-tsl1.amigos.org/txallenmemorial/',
      web_url: 'https://www.hawkinslibrary.org/',
    },
    uuid: '7',
  },
  {
    areas: {
      focus: ['Alpine, TX'],
      service: [],
    },
    basic_info: {
      description:
        'Building community, encouraging literacy, and promoting lifelong learning',
      internal_urn: '',
      name: 'Alpine Public Library, TX',
      number_of_patrons: '59',
      online_registration: '',
      pls_id: '',
      short_name: 'NQSJGC',
      timestamp: '',
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txalpine/authentication_document',
      contact_email: 'williams@amigos.org',
      contact_validated: '',
      copyright_email: 'don@alpinepubliclibrary.org',
      copyright_validated: '',
      help_email: 'don@alpinepubliclibrary.org',
      help_validated: '',
      opds_url: 'https://simplye-tsl1.amigos.org/txalpine/',
      web_url: 'https://alpinepubliclibrary.org/',
    },

    uuid: '8',
  },
  {
    areas: {
      focus: ['Amarillo, TX'],
      service: [],
    },

    basic_info: {
      description: 'Serving the patrons of Amarillo, TX',
      internal_urn: '',
      name: 'Amarillo Public Library, TX',
      number_of_patrons: '78',
      online_registration: '',
      pls_id: '',
      short_name: 'DTENGN',
      timestamp: '',
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txamarillopubliclibrary/authentication_document',
      contact_email: 'simplye@amigos.org',
      contact_validated: '',
      copyright_email: 'reference@amarillolibrary.org',
      copyright_validated: '',
      help_email: 'reference@amarillolibrary.org',
      help_validated: '',
      opds_url: 'https://simplye-tsl1.amigos.org/txamarillopubliclibrary/',
      web_url: 'https://www.amarillolibrary.org/',
    },

    uuid: '9',
  },
  {
    areas: {
      focus: ['Dallas, TX'],
      service: [],
    },

    basic_info: {
      description: 'Unite Libraries for Action and Strength',
      internal_urn: '',
      name: 'Amigos Demo Library',
      number_of_patrons: '22',
      online_registration: '',
      pls_id: '',
      short_name: 'WBDOBX',
      timestamp: '',
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
    urls_and_contact: {
      authentication_url:
        'https://circ05.simplye.amigos.org/txamigosls/authentication_document',
      contact_email: 'simplye@amigos.org',
      contact_validated: '',
      copyright_email: 'simplye@amigos.org',
      copyright_validated: '',
      help_email: 'simplye@amigos.org',
      help_validated: '',
      opds_url: 'https://circ05.simplye.amigos.org/txamigosls/',
      web_url: 'https://www.amigos.org',
    },
    uuid: '10',
  },
  {
    areas: {
      focus: ['Dallas, TX'],
      service: [],
    },

    basic_info: {
      description: 'Unite Libraries for Action and Strength',
      internal_urn: '',
      name: 'Amigos Test Library Two',
      number_of_patrons: '0',
      online_registration: '',
      pls_id: '',
      short_name: 'ZKVRQT',
      timestamp: '',
    },
    stages: {
      library_stage: 'testing',
      registry_stage: 'testing',
    },
    urls_and_contact: {
      authentication_url:
        'https://circ06.dev.simplye.amigos.org/txamgtesttwo/authentication_document',
      contact_email: 'williams@amigos.org',
      contact_validated: '',
      copyright_email: 'williams@amigos.org',
      copyright_validated: '',
      help_email: 'simplye@amigos.org',
      help_validated: '',
      opds_url: 'https://circ06.dev.simplye.amigos.org/txamgtesttwo/',
      web_url: 'https://www.amigos.org/simplye',
    },

    uuid: '11',
  },
  {
    areas: {
      focus: [],
      service: [],
    },
    basic_info: {
      description: 'Serving Anacortes, WA',
      internal_urn: '',
      name: 'Anacortes Public Library',
      number_of_patrons: '0',
      online_registration: '',
      pls_id: '',
      short_name: 'DCJROE',
      timestamp: '',
    },

    stages: {
      library_stage: 'testing',
      registry_stage: 'cancelled',
    },
    urls_and_contact: {
      authentication_url:
        'https://wa-shared.lyrasistechnology.org/WA0032/authentication_document',
      contact_email: 'library@cityofanacortes.org',
      contact_validated: '',
      copyright_email: 'library@cityofanacortes.org',
      copyright_validated: '',
      help_email: 'library@cityofanacortes.org',
      help_validated: '',
      opds_url: 'https://wa-shared.lyrasistechnology.org/WA0032/',
      web_url: 'https://www.anacorteswa.gov/220/Library',
    },

    uuid: '12',
  },
  {
    areas: {
      focus: ['Andrews, TX'],
      service: [],
    },

    basic_info: {
      description: 'Explore the world of books.',
      internal_urn: '',
      name: 'Andrews County Library, TX',
      number_of_patrons: '1',
      online_registration: '',
      pls_id: '',
      short_name: 'IDKEWG',
      timestamp: '',
    },

    stages: {
      library_stage: 'production',
      registry_stage: 'production',
    },
    urls_and_contact: {
      authentication_url:
        'https://simplye-tsl1.amigos.org/txandrews/authentication_document',
      contact_email: 'simplye@amigos.org',
      contact_validated: '',
      copyright_email: 'dbonham@andrews.lib.tx.us',
      copyright_validated: '',
      help_email: 'dbonham@andrews.lib.tx.us',
      help_validated: '',
      opds_url: 'https://simplye-tsl1.amigos.org/txandrews/',
      web_url: 'https://www.andrews.lib.tx.us/',
    },
    uuid: '13',
  },
  {
    areas: {
      focus: ['Everywhere'],
      service: [],
    },

    basic_info: {
      description: 'Educate. Enrich. Inspire.',
      internal_urn: '',
      name: 'Anne Arundel Co. Public Library',
      number_of_patrons: '0',
      online_registration: '',
      pls_id: '',
      short_name: 'MDANNE',
      timestamp: '',
    },
    stages: {
      library_stage: 'production',
      registry_stage: 'cancelled',
    },
    urls_and_contact: {
      authentication_url:
        'https://anne-arundel.simplye-md.org/ANNEARUNDEL/authentication_document',
      contact_email: 'askus@aacpl.libanswers.com',
      contact_validated: '',
      copyright_email: 'askus@aacpl.libanswers.com',
      copyright_validated: '',
      help_email: 'askus@aacpl.libanswers.com',
      help_validated: '',
      opds_url: 'https://anne-arundel.simplye-md.org/ANNEARUNDEL/',
      web_url: 'web_urlhttp://www.aacpl.net',
    },

    uuid: '14',
  },
  {
    areas: {
      focus: ['Everywhere'],
      service: [],
    },

    basic_info: {
      description: 'Serving Ansonia, CT',
      internal_urn: '',
      name: 'Ansonia Public Library',
      number_of_patrons: '0',
      online_registration: '',
      pls_id: '',
      short_name: 'CTANSO',
      timestamp: '',
    },
    stages: {
      library_stage: 'cancelled',
      registry_stage: 'cancelled',
    },
    urls_and_contact: {
      authentication_url:
        'https://bibliomation.lyrasistechnology.org/ansonia/authentication_document',
      contact_email: 'jonathan.green@lyrasis.org',
      contact_validated: '',
      copyright_email: 'jonathan.green@lyrasis.org',
      copyright_validated: '',
      help_email: 'jonathan.green@lyrasis.org',
      help_validated: '',
      opds_url: 'https://bibliomation.lyrasistechnology.org/ansonia/',
      web_url: 'http://www.ansonialibrary.org/',
    },

    uuid: '15',
  },
];

export default mockLibraries;
