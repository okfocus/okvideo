module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: [
					'src/okvideo.js'

				],
				dest: 'src/okvideo.concat.js',
			}
		},
		uglify: {
			options: {
				banner: '/* okvideo by okfocus ~ v2.3.3 ~ https://github.com/okfocus/okvideo */\n'
			},
			build: {
				src: 'src/okvideo.concat.js',
				dest: 'src/okvideo.min.js'
			}
		},
		watch: {
			files: ['js/!(live.min|live.concat).js','js/vendor/*'],
			tasks: ['default']
		}
	});

	// Load tasks that we'll be using
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');


	// Default task(s).
	grunt.registerTask('default', ['concat', 'uglify']);
};
